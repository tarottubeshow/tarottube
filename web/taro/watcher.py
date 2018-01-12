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
                    path = path.split('/')[-1].replace('.m3u8', '')
                    parts = path.split('_')
                    if len(parts) == 1:
                        quality = 'high'
                        key = parts[0]
                    else:
                        (key, quality) = parts

                    timeslot = Timeslot.forStreamKey(key)
                    timeslot.putPlaylist('m3u8', quality, m3u8Contents)

                    TimeslotEvent(
                        timeslot=timeslot,
                        time=now,
                        quality=quality,
                        type='m3u8',
                        payload={
                            'contents': m3u8Contents,
                        },
                    ).put()


def startWatchers():
    observer = Observer()
    observer.schedule(
        M3u8Handler(),
        '/opt/mount/frags/hls',
        recursive=False,
    )
    observer.start()

    print("OBSERVER STARTED")
