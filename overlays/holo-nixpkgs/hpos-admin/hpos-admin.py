from base64 import b64encode
from flask import Flask, jsonify, request
from hashlib import sha512
import json
import logging
import os
from gevent import subprocess
from datetime import datetime

log = logging.getLogger(__name__)

app = Flask(__name__)


def get_state_path():
    return os.getenv('HPOS_STATE_PATH')


def get_state_data():
    with open(get_state_path(), 'r') as f:
        return json.loads(f.read())

def cas_hash(data):
    dump = json.dumps(data, separators=(',', ':'), sort_keys=True)
    return b64encode(sha512(dump.encode()).digest())


@app.route('/v1/config', methods=['GET'])
def get_config():
    config = get_state_data()['v1']['config']
    return jsonify(config), 200, { 'x-hpos-admin-cas': cas_hash(config) }

# APIs that require a nixos-rebuild after mutating HPOS state may trigger it using rebuild.go().
# This is a gevent-compatible Greenlet scheduler, that ensures only one invocation runs at a time.
from runner import Runner
rebuild = Runner( ['sudo', 'nixos-rebuild', '--upgrade', 'switch'] )
rebuild.start()

@app.route('/v1/config', methods=['PUT'])
def put_config():
    state = get_state_data()
    if request.headers['x-hpos-admin-cas'] == cas_hash(state['v1']['config']):
        state['v1']['config'] = request.get_json(force=True)
        with open(get_state_path() + '.tmp', 'w') as f:
            f.write(json.dumps(state, indent=2))
            os.rename(f.name, get_state_path())
        rebuild.go()
        return '', 200
    else:
        return '', 409


def zerotier_info():
    proc = subprocess.Popen(
        [ 'sudo', 'zerotier-cli', '-j', 'info' ],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    stdout, stderr = proc.communicate()
    assert not proc.returncode, \
        f"Failed to obtain ZeroTier info: {stderr}"
    return json.loads(stdout)


@app.route('/v1/status', methods=['GET'])
def status():
    return jsonify({
        'zerotier': zerotier_info()
    })

@app.route('/v1/upgrade', methods=['POST'])
def upgrade():
    rebuild.go()
    return '', 200


if __name__ == '__main__':
    logging.basicConfig( level=logging.WARNING )
    from gevent.pywsgi import WSGIServer
    WSGIServer(('::1', 5000), app).serve_forever()
