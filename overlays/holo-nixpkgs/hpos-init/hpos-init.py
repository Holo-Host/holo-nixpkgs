from glob import glob
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
import json
import logging
import os
import subprocess
import sys
import time
import wormhole

WORMHOLE_ACK = wormhole.util.dict_to_bytes({"answer": {"message_ack": "ok"}})
WORMHOLE_APPID = 'lothar.com/wormhole/text-or-file-xfer'
WORMHOLE_RELAY_URL = 'ws://relay.magic-wormhole.io:4000/v1'

REVERSE_SEND_INSTRUCTIONS = \
    """HPOS state was not found. On the other computer, download hpos-state.json
at <https://quickstart.holo.host>, install Magic Wormhole, and run:

wormhole send --code {} --text - < hpos-state.json
"""

"""
hpos-init -- recover and output hpos-state.json path (if successful)
"""

@inlineCallbacks
def wormhole_reverse_send():
    w = wormhole.create(WORMHOLE_APPID, WORMHOLE_RELAY_URL, reactor)
    w.allocate_code()

    code = yield w.get_code()
    try:
        subprocess.run(['wall', f"wormhole send --code {code} --text - < hpos-state.json"], check=True)
        message_json = yield w.get_message() # A crypto failure will result in an Exception
        message = json.loads(message_json)['offer']['message']
    except Exception as exc:
        logging.warning(f"Failed to receive HPOS State file via magic-wormhole: {exc!r}")
        raise

    yield w.send_message(WORMHOLE_ACK)
    yield w.close()

    return message


@inlineCallbacks
def state_path():
    paths = glob('/etc/hpos-state.json') + glob('/media/*/hpos-state.json')
    if paths == []:
        logging.info(f"HPOS State file not found; requesting via magic-wormhole")
        try:
            state = yield wormhole_reverse_send()
            # Received hpos-state.json via magic wormhole; do some basic sanity checking
            email = json.loads(state)['v1']['config']['admin']['email']
            logging.info(f"Received HPOS State w/ admin email: {email}")
            with open('/etc/hpos-state.json', 'w') as f:
                f.write(state)
        except Exception as exc:
            logging.warning(f"Failed to parse/store HPOS State file: {exc!r}")
            return '' # Signals a failure to recover HPOS State
        return '/etc/hpos-state.json'
    return paths[0]


@inlineCallbacks
def main():
    """Caller expects HPOS State file path on stdout, or nothing on failure."""
    try:
        path = yield state_path()
        logging.info(f"HPOS State: {path!r}")
        assert path, "No HPOS State recovered"
        print(path)
    except Exception as exc:
        logging.warning(f"HPOS Init Failed: {exc!r}")
    finally:
        reactor.callLater(0, reactor.stop)


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()
    reactor.run()
