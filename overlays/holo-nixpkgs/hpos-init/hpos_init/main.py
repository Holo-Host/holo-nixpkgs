from glob import glob
from twisted.internet import defer, reactor
from wormhole.errors import WormholeError
import functools
import hpos_seed
import logging
import os
import sys
import time


log = logging.getLogger(__name__)


@functools.lru_cache()
def runtime_dir():
    return os.getenv('RUNTIME_DIRECTORY', '.')


@functools.lru_cache()
def state_dir():
    return os.getenv('STATE_DIRECTORY', '.')


@functools.lru_cache()
def runtime_config_path():
    return runtime_dir() + '/hpos-config.json'


@functools.lru_cache()
def state_config_path():
    return state_dir() + '/hpos-config.json'


@functools.lru_cache()
def wormhole_code_path():
    return runtime_dir() + '/wormhole-code.txt'


def ensureDeferred(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        result = f(*args, **kwargs)
        return defer.ensureDeferred(result)
    return wrapper


@ensureDeferred
async def receive_config(backoff_exp=1):
    def on_wormhole_code(wormhole_code):
        with open(wormhole_code_path(), 'w') as f:
            f.write(wormhole_code)
    try:
        config = await hpos_seed.receive(on_wormhole_code, reactor)
        with open(state_config_path(), 'wb') as f:
            f.write(config)
    except WormholeError as e:
        backoff = 2 ** backoff_exp
        (exc_type, _, _) = sys.exc_info()
        log.warning("receive failed with %s, retrying in %d seconds",
                    exc_type, backoff)
        reactor.callLater(backoff, receive_config, backoff_exp + 1)
    except:
        log.warning("Wormhole receive failed with %s, process will now terminate")
    finally:
        if os.path.exists(wormhole_code_path()):
            os.remove(wormhole_code_path())


def scan_config_paths():
    return glob(state_config_path()) + glob('/media/*/hpos-config.json')


@ensureDeferred
async def scan_for_config():
    config_paths = scan_config_paths()
    if config_paths:
        try:
            os.symlink(config_paths[0], runtime_config_path())
        finally:
            reactor.callLater(0, reactor.stop)
    reactor.callLater(1, scan_for_config)


def main():
    if glob(runtime_config_path()) == []:
        reactor.callLater(0, receive_config)
        reactor.callLater(0, scan_for_config)
        reactor.run()


if __name__ == '__main__':
    main()
