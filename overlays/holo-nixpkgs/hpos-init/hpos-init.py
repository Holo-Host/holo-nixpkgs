from glob import glob
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
import json
import os
import wormhole

WORMHOLE_ACK = wormhole.util.dict_to_bytes({"answer": {"message_ack": "ok"}})
WORMHOLE_APPID = 'lothar.com/wormhole/text-or-file-xfer'
WORMHOLE_RELAY_URL = 'ws://relay.magic-wormhole.io:4000/v1'

REVERSE_SEND_INSTRUCTIONS = \
    """HPOS state was not found. On the other computer, download hpos-state.json
at <https://quickstart.holo.host>, install Magic Wormhole, and run:

wormhole send --code {} --text - < hpos-state.json
"""


@inlineCallbacks
def wormhole_reverse_send():
    w = wormhole.create(WORMHOLE_APPID, WORMHOLE_RELAY_URL, reactor)
    w.allocate_code()

    code = yield w.get_code()
    print(REVERSE_SEND_INSTRUCTIONS.format(code))

    message = yield w.get_message()
    message = json.loads(message)['offer']['message']

    yield w.send_message(WORMHOLE_ACK)
    yield w.close()

    return message


@inlineCallbacks
def state_path():
    paths = glob('/etc/hpos-state.json') + glob('/media/*/hpos-state.json')
    if paths == []:
        state = yield wormhole_reverse_send()
        with open('/etc/hpos-state.json', 'w') as f:
            f.write(state)
        return '/etc/hpos-state.json'
    return paths[0]


@inlineCallbacks
def main():
    path = yield state_path()
    print(path)
    reactor.callLater(0, reactor.stop)


if __name__ == '__main__':
    main()
    reactor.run()
