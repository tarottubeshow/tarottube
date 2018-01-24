import time

from taro import firebase
from taro import sqla
from taro import starting
from taro.models import *

POLL_FREQ = 3600

def syncToFirebase():
    print("Syncing to firebase!")
    with sqla.BaseModel.sessionContext():
        timeslots = {}
        playlists = {}

        for timeslot in Timeslot.queryUpcoming():
            timeslots[timeslot.stream_key] = timeslot.getJson()
            for playlist in TimeslotPlaylist.forTimeslot(timeslot):
                playlists[playlist._getFirebaseKey()] = playlist.getJson()

        print(timeslots)
        print(playlists)
        fbdb = firebase.getShard()
        fbdb.child('timeslots').set(timeslots)
        fbdb.child('playlists').set(playlists)

if __name__ == '__main__':
    starting.waitForPsql()
    while True:
        syncToFirebase()
        time.sleep(POLL_FREQ)
