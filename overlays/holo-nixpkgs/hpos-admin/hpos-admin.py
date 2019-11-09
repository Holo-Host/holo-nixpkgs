from base64 import b64encode
from flask import Flask, jsonify, request
from gevent import subprocess, pywsgi, queue, spawn, lock
from hashlib import sha512
from tempfile import mkstemp
import json
import logging
import os

app = Flask(__name__)
log = logging.getLogger(__name__)
rebuild_queue = queue.PriorityQueue()
lock = lock.Semaphore(1)


def rebuild_worker():
    while True:
        (_, cmd) = rebuild_queue.get()
        rebuild_queue.queue.clear()
        subprocess.run(cmd)


def rebuild(priority, args):
    rebuild_queue.put((priority, ['sudo', 'nixos-rebuild', 'switch'] + args))


def get_state_path():
    return os.getenv('HPOS_STATE_PATH')


def get_state_data():
    with open(get_state_path(), 'r') as f:
        return json.loads(f.read())


def cas_hash(data):
    dump = json.dumps(data, separators=(',', ':'), sort_keys=True)
    return b64encode(sha512(dump.encode()).digest()).decode()


@app.route('/v1/config', methods=['GET'])
def get_config():
    return jsonify(get_state_data()['v1']['config'])


def replace_file_contents(path, data):
    fd, tmp_path = mkstemp(dir=os.path.dirname(path))
    with open(fd, 'w') as f:
        f.write(data)
    os.rename(tmp_path, path)


@app.route('/v1/config', methods=['PUT'])
def put_config():
    with lock: # Ensure no race condition in checking state CAS hash, to replacing state
        state = get_state_data()
        if request.headers.get('x-hpos-admin-cas') != cas_hash(state['v1']['config']):
            return '', 409
        state['v1']['config'] = request.get_json(force=True)
        replace_file_contents(get_state_path(), json.dumps(state, indent=2))
    rebuild(priority=5, args=[])
    return '', 200



def zerotier_info():
    proc = subprocess.run(['sudo', 'zerotier-cli', '-j', 'info'],
                          capture_output=True, check=True)
    return json.loads(proc.stdout)


@app.route('/v1/status', methods=['GET'])
def status():
    return jsonify({
        'zerotier': zerotier_info()
    })


@app.route('/v1/upgrade', methods=['POST'])
def upgrade():
    rebuild(priority=1, args=['--upgrade'])
    return '', 200


if __name__ == '__main__':
    spawn(rebuild_worker)
    pywsgi.WSGIServer(('::1', 5000), app).serve_forever()
