import time

from taro import firebase
from taro import sqla
from taro.models import *

POLL_FREQ = 60

def syncActiveRecord(key):
    print("Examining key: %s" % key)
    timeslot = Timeslot.forStreamKey(key)
    if not timeslot:
        return

    removed = timeslot.syncToFirebase()
    if removed:
        print("It was removed.")
        query = TimeslotPlaylist.query()\
            .filter(TimeslotPlaylist.timeslot == timeslot)
        for playlist in query:
            playlist._onSync()

def runCron():
    with sqla.BaseModel.sessionContext():
        fbdb = firebase.getShard()
        data = fbdb.child('timeslots').get().val()
        if not data:
            return

        for key in data.keys():
            syncActiveRecord(key)

if __name__ == '__main__':
    while True:
        print("Running cleanup cron...")
        runCron()
        time.sleep(POLL_FREQ)
