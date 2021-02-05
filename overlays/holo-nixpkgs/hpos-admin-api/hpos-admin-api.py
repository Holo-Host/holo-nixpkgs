from base64 import b64encode
from flask import Flask, jsonify, request
from functools import reduce
from gevent import subprocess, pywsgi, queue, socket, spawn, lock
from gevent.subprocess import CalledProcessError
from hashlib import sha512
from pathlib import Path
from tempfile import mkstemp
import json
import os
import subprocess
import toml
import requests


PROFILES_TOML_PATH = '/run/hpos-admin-api/hpos-admin-features.toml'


app = Flask(__name__)
rebuild_queue = queue.PriorityQueue()
state_lock = lock.Semaphore()


def rebuild_worker():
    while True:
        (_, cmd) = rebuild_queue.get()
        rebuild_queue.queue.clear()
        subprocess.run(cmd)


def rebuild(priority, args):
    rebuild_queue.put((priority, ['nixos-rebuild', 'switch'] + args))


def get_state_path():
    hpos_config_file_symlink = os.getenv('HPOS_CONFIG_PATH')
    hpos_config_file = os.path.realpath(hpos_config_file_symlink)
    return hpos_config_file


def get_state_data():
    with open(get_state_path(), 'r') as f:
        return json.loads(f.read())


def cas_hash(data):
    dump = json.dumps(data, separators=(',', ':'), sort_keys=True)
    return b64encode(sha512(dump.encode()).digest()).decode()


@app.route('/config', methods=['GET'])
def get_settings():
    return jsonify(get_state_data()['v1']['settings'])


def replace_file_contents(path, data):
    fd, tmp_path = mkstemp(dir=os.path.dirname(path))
    with open(fd, 'w') as f:
        f.write(data)
    os.rename(tmp_path, path)


@app.route('/config', methods=['PUT'])
def put_settings():
    with state_lock:
        state = get_state_data()
        expected_cas = cas_hash(state['v1']['settings'])
        received_cas = request.headers.get('x-hpos-admin-cas')
        if received_cas != expected_cas:
            app.logger.warning('CAS mismatch: {} != {}'.format(received_cas, expected_cas))
            return '', 409
        state['v1']['settings'] = request.get_json(force=True)
        state_json = json.dumps(state, indent=2)
        try:
            subprocess.run(['hpos-config-is-valid'], check=True, input=state_json, text=True)
        except CalledProcessError:
            return '', 400
        replace_file_contents(get_state_path(), state_json)
    # FIXME: see next FIXME
    # rebuild(priority=5, args=[])
    return '', 200


# Toggling HPOS features:


def read_profiles():
    if Path(PROFILES_TOML_PATH).is_file():
        return toml.load(PROFILES_TOML_PATH)
    else:
        return {}


def write_profiles(profiles):
    with open(PROFILES_TOML_PATH, 'w') as f:
        f.write(toml.dumps(profiles))


def set_feature_state(profile, feature, enable = True):
    profiles = read_profiles()
    profiles.update({
        profile: {
            'features': {
                feature: {
                    'enable': enable
                }
            }
        }
    })
    write_profiles(profiles)
    return jsonify({
        'enabled': enable
    })


@app.route('/profiles', methods=['GET'])
def get_profiles():
    return jsonify({
        'profiles': read_profiles()
    })


@app.route('/profiles/<profile>/features/<feature>', methods=['GET'])
def get_feature_state(profile, feature):
    profiles = read_profiles()
    keys = [profile, 'features', feature, 'enable']
    enabled = reduce(lambda d, key: d.get(key) if d else None, keys, profiles) or False
    return jsonify({
        'enabled': enabled
    })


@app.route('/profiles/<profile>/features/<feature>', methods=['PUT'])
def enable_feature(profile, feature):
    return set_feature_state(profile, feature, True)


@app.route('/profiles/<profile>/features/<feature>', methods=['DELETE'])
def disable_feature(profile, feature):
    return set_feature_state(profile, feature, False)


def hydra_channel():
    with open('/run/.nix-channels') as f:
        channel_url = f.read()
    return channel_url.split('/')[6]


def hydra_revision():
    channel = hydra_channel()
    eval_url = 'https://hydra.holo.host/jobset/holo-nixpkgs/' + channel + '/latest-eval'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    eval_summary = requests.get(eval_url, headers=headers).json()
    return eval_summary['jobsetevalinputs']['holo-nixpkgs']['revision']


def local_revision():
    try:
        with open('/run/.nix-revision') as f:
            local_revision = f.read()
    except:
        local_revision = 'unversioned'
    return local_revision


@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        'holo_nixpkgs':{
            'channel': {
                'name': hydra_channel(),
                'rev': hydra_revision()
            },
            'current_system': {
                'rev': local_revision()
            }
        }
    })


@app.route('/upgrade', methods=['POST'])
def upgrade():
    # FIXME: calling nixos-rebuild fails
    # rebuild(priority=1, args=['--upgrade'])
    return '', 503 # service unavailable


@app.route('/reset', methods=['POST'])
def reset():
    try:
        subprocess.run(['hpos-reset'], check=True)
    except CalledProcessError:
        return '', 500


def unix_socket(path):
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    if os.path.exists(path):
        os.remove(path)
    sock.bind(path)
    sock.listen()
    return sock


if __name__ == '__main__':
    spawn(rebuild_worker)
    pywsgi.WSGIServer(unix_socket('/run/hpos-admin-api/hpos-admin-api.sock'), app).serve_forever()
