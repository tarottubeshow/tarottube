import time

from taro import firebase
from taro import sqla
from taro import starting
from taro.models import *

POLL_FREQ = 600

def runCron():
    with sqla.BaseModel.sessionContext():
        timeslots = {}
        playlists = {}

        for timeslot in Timeslot.queryUpcoming():
            timeslots[timeslot.stream_key] = timeslot.getJson()
            for playlist in TimeslotPlaylist.forTimeslot(timeslot):
                playlists[playlist._getFirebaseKey()] = playlist.getJson()

        print("Syncing to firebase:")
        print(timeslots)
        print(playlists)
        fbdb = firebase.getShard()
        fbdb.child('timeslots').set(timeslots)
        fbdb.child('playlists').set(playlists)

if __name__ == '__main__':
    while True:
        starting.waitForPsql()
        runCron()
        time.sleep(POLL_FREQ)
