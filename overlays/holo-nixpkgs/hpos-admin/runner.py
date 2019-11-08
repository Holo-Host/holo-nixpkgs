import logging
import time

from gevent import Greenlet, sleep
from gevent.event import Event
from gevent.subprocess import Popen

log				= logging.getLogger( "gevent Event" )

class Runner( Greenlet ):
    """Performs a command (is/returns a list) on demand from multiple parties, but only once at a time.
    In other words, one we detect that we're supposed to start the command, we'll loop around and
    wait 'til anyone else calls .go().

    """
    def __init__( self, command, *args, **kwds ):
        self._event		= Event()
        self._command		= command # callable or list
        self._done		= False
        self.trigger		= 0
        self.counter		= 0
        super().__init__( *args, **kwds )
        log.info(f"{self} Starting")

    def __str__( self ):
        return f"Runner({self.command})"

    def __del__( self ):
        self.done		= True
        self.join()

    @property
    def command( self ):
        if hasattr(self._command, '__call__'):
            return self._command(self)
        return self._command

    @property
    def done( self ):
        return self._done
    @done.setter
    def done( self, value ):
        self._done		= bool( value )
        if self._done:
            self.go()

    def go( self ):
        self.trigger	       += 1
        self._event.set()

    def _run( self ):
        """Await Event.set() via self.go(), and loop 'til self.done is set"""
        log.info(f"{self}: Ready to go")
        try:
            while self._event.wait() and not self.done:
                self.counter   += 1
                log.info(f"{self}: Run {self.counter}, w/ {self.trigger} triggers")
                self._event.clear()
                # Calls to self.go() *after* this will point will cause a further execution of command!
                try:
                    status 	= Popen( self.command )
                    status.wait()
                    (log.warning if status.returncode else log.info)(
                        f"{self}: Run {self.counter} Exit: {status.returncode}" )
                except Exception as exc:
                    log.warning(
                        f"{self}: Run {self.counter} Exception: {exc}" )
        finally:
            log.info(f"{self}: Finished after {self.counter} runs, {self.trigger} triggers")
