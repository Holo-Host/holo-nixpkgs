from base64 import b64encode
from flask import Flask, jsonify, request
from hashlib import sha512
import json
import logging
import os

from gevent import Greenlet, subprocess
from gevent.event import Event
from gevent.subprocess import Popen


app = Flask(__name__)
log = logging.getLogger(__name__)


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
    return jsonify(config), 200, {'x-hpos-admin-cas': cas_hash(config)}


class Runner(Greenlet):
    """
    Performs a command (which is/returns a list) on demand from multiple parties, but only once at a
    time.  In other words, when we detect that we're supposed to start the command, we'll loop
    around and wait 'til anyone else calls (or has already called) self.go().
    """

    def __init__(self, command, *args, **kwds):
        self._event = Event()
        self._command = command  # callable or list
        self._done = False
        self.trigger = 0
        self.counter = 0
        super().__init__(*args, **kwds)
        log.info(f"{self} Starting")

    def __str__(self):
        return f"Runner({self.command})"

    def __del__(self):
        self.done = True
        self.join()

    @property
    def command(self):
        if hasattr(self._command, '__call__'):
            return self._command(self)
        return self._command

    @property
    def done(self):
        return self._done

    @done.setter
    def done(self, value):
        self._done = bool(value)
        if self._done:
            self.go()

    def go(self):
        self.trigger += 1
        self._event.set()

    def _run(self):
        """Await Event.set() via self.go(), and loop 'til self.done is set"""
        log.info(f"{self}: Ready to go")
        try:
            while self._event.wait() and not self.done:
                self.counter += 1
                log.info(
                    f"{self}: Run {self.counter}, w/ {self.trigger} triggers")
                self._event.clear()
                # Calls to self.go() *after* this will point will cause a further execution of command!
                try:
                    status = Popen(self.command)
                    status.wait()
                    (log.warning if status.returncode else log.info)(
                        f"{self}: Run {self.counter} Exit: {status.returncode}")
                except Exception as exc:
                    log.warning(
                        f"{self}: Run {self.counter} Exception: {exc}")
        finally:
            log.info(
                f"{self}: Finished after {self.counter} runs, {self.trigger} triggers")


rebuild = Runner(['sudo', 'nixos-rebuild', '--upgrade', 'switch'])
rebuild.start()


@app.route('/v1/config', methods=['PUT'])
def put_config():
    state = get_state_data()
    if request.headers['x-hpos-admin-cas'] == cas_hash(state['v1']['config']):
        state['v1']['config'] = request.get_json(force=True)
        with open(get_state_path() + '.tmp', 'w', encoding='utf-8') as f:
            f.write(json.dumps(state, indent=2))
            os.rename(f.name, get_state_path())
        rebuild.go()
        return '', 200
    else:
        return '', 409


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
    rebuild.go()
    return '', 200


if __name__ == '__main__':
    from gevent.pywsgi import WSGIServer
    WSGIServer(('::1', 5000), app).serve_forever()
