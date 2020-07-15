from base64 import b64encode
from flask import Flask, jsonify, request
from gevent import subprocess, pywsgi, queue, socket, spawn, lock
from gevent.subprocess import CalledProcessError
from hashlib import sha512
from tempfile import mkstemp
import json
import os
import subprocess
import toml
import requests

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
    rebuild(priority=5, args=[])
    return '', 200


def hosted_happs():
    conductor_config = toml.load('/var/lib/holochain-conductor/conductor-config.toml')
    return [dna for dna in conductor_config['dnas'] if dna['holo-hosted']]


def hosted_instances():
    conductor_config = toml.load('/var/lib/holochain-conductor/conductor-config.toml')
    return [instance for instance in conductor_config['instances'] if instance['holo-hosted']]


@app.route('/hosted_happs', methods=['GET'])
def get_hosted_happs():

    hosted_happs_list = hosted_happs()
    hosted_instances_list = hosted_instances()
    
    if len(hosted_happs_list) > 0:
        for hosted_happ in hosted_happs_list:
            if len(hosted_instances_list) > 0:
                num_instances = sum(hosted_happ['id'] == hosted_instance['id'] for hosted_instance in hosted_instances_list)
            else: 
                num_instances = 0
            hosted_happ['number_instances'] = num_instances

    return jsonify({
        'hosted_happs': hosted_happs_list
    })


def hydra_channel():
    with open('/root/.nix-channels') as f:
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
        with open('/root/.nix-revision') as f:
            local_revision = f.read()
    except:
        local_revision = 'unversioned'
    return local_revision


def zerotier_info():
    proc = subprocess.run(['zerotier-cli', '-j', 'info'],
                          capture_output=True, check=True)
    return json.loads(proc.stdout)


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
        },
        'zerotier': zerotier_info()
    })


@app.route('/upgrade', methods=['POST'])
def upgrade():
    rebuild(priority=1, args=['--upgrade'])
    return '', 200


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
    pywsgi.WSGIServer(unix_socket('/run/hpos-admin.sock'), app).serve_forever()
