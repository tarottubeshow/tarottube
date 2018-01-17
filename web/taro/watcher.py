import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from taro import sqla
from taro.models import *

DEBOUNCE_CUTOFF = datetime.timedelta(seconds=3)

class M3u8Handler(FileSystemEventHandler):

    def __init__(self):
        self.debounce = {}

    def on_created(self, event):
        self.debounceEvent(event.src_path)

    def on_moved(self, event):
        self.debounceEvent(event.dest_path)

    def on_modified(self, event):
        self.debounceEvent(event.src_path)

    def debounceEvent(self, path):
        now = datetime.datetime.now()
        if(path.endswith('.m3u8')):
            last = self.debounce.get(path)
            if (last is None) or (now - last > DEBOUNCE_CUTOFF):
                self.debounce[path] = now

                print("DETECTED M3U8 CHANGE - %s" % path)
                with open(path) as f:
                    m3u8Contents = f.read()

                with sqla.BaseModel.sessionContext():
                    path = path.replace('.m3u8', '').split('/')
                    key = path[-1]
                    quality = path[-2]

                    timeslot = Timeslot.forStreamKey(key)
                    details = self.computeM3u8Details(m3u8Contents)
                    print(details)
                    timeslot.putPlaylist('m3u8', quality, {
                        'src': m3u8Contents,
                        'duration': details['duration'],
                        'mapping': details['mapping'],
                    })

                    TimeslotEvent(
                        timeslot=timeslot,
                        time=now,
                        quality=quality,
                        type='m3u8',
                        payload={
                            'contents': m3u8Contents,
                        },
                    ).put()

    def computeM3u8Details(self, m3u8Contents):
        tsDuration = 0
        duration = 0
        mapping = []
        for line in m3u8Contents.split('\n'):
            match = re.match(r'#EXTINF:([0-9.]+)', line)
            if match:
                tsDuration = int(1000 * float(match.group(1)))
                duration += tsDuration

            match = re.search(r'-([0-9]+)\.ts$', line)
            if match:
                timestamp = int(match.group(1))
                start = (duration - tsDuration)
                mapping.append([timestamp, start, tsDuration])

        return {
            'duration': duration,
            'mapping': mapping,
        }


def startWatchers():
    observer = Observer()
    observer.schedule(
        M3u8Handler(),
        '/opt/mount/frags/hls',
        recursive=True,
    )
    observer.start()

    print("OBSERVER STARTED")
