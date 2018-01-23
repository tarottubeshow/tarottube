import re
import subprocess
import time
import traceback
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from taro import sqla
from taro.models import *

DEBOUNCE_CUTOFF = datetime.timedelta(seconds=1)
WATCH_DIRS = [
    '/opt/mount/frags/hls/high',
    '/opt/mount/frags/hls/low',
    '/opt/mount/frags/flv/high',
    '/opt/mount/frags/flv/low',
]

class FileHandler(FileSystemEventHandler):

    def __init__(self):
        self.debounce = {}
        self.handlers = {
            'm3u8': self._handleM3u8,
            'flv': self._handleFlv,
        }

    def on_created(self, event):
        self.debounceEvent(event.src_path)

    def on_moved(self, event):
        self.debounceEvent(event.dest_path)

    def on_modified(self, event):
        self.debounceEvent(event.src_path)

    def debounceEvent(self, path):
        try:
            self._debounceEvent(path)
        except:
            print(traceback.format_exc())

    def _debounceEvent(self, path):
        now = datetime.datetime.now()
        handler = self._getHandler(path)
        if handler is None:
            return

        last = self.debounce.get(path)
        if (last is None) or (now - last > DEBOUNCE_CUTOFF):
            handler(now, path)
            self.debounce[path] = now

    def _getHandler(self, path):
        for ext, handler in self.handlers.items():
            if path.endswith('.%s' % ext):
                return handler

    def _handleFlv(self, now, path):
        print("DETECTED FLV CHANGE - %s" % path)

        with sqla.BaseModel.sessionContext():
            parts = path.replace('.flv', '').split('/')
            fname = parts[-1]
            quality = parts[-2]
            [key, timestamp] = fname.split('.')

            timeslot = Timeslot.forStreamKey(key)
            relPath = "%s/%s.%s.flv" % (quality, key, timestamp)

            timeslot.putPlaylist('flv', quality, {
                'version': 1,
                'timestamp': timestamp,
                'flv': relPath,
                'mp4': relPath.replace('.flv', '.mp4'),
            })

            subprocess.check_call([
                '/usr/bin/ffmpeg',
                '-i', path,
                '-codec', 'copy',
                path.replace('.flv', '.mp4'),
            ])

            TimeslotEvent(
                timeslot=timeslot,
                time=now,
                quality=quality,
                type='flv',
                payload={
                    'timestamp': timestamp,
                    'path': relPath,
                },
            ).put()

            # TODO: write to google cloud storage?

    def _handleM3u8(self, now, path):
        print("DETECTED M3U8 CHANGE - %s" % path)
        with open(path) as f:
            m3u8Contents = f.read()

        with sqla.BaseModel.sessionContext():
            parts = path.replace('.m3u8', '').split('/')
            key = parts[-1]
            quality = parts[-2]

            timeslot = Timeslot.forStreamKey(key)
            details = self.computeM3u8Details(m3u8Contents)

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

def startWatchers(join=True):
    handler = FileHandler()
    observer = Observer()
    for dir in WATCH_DIRS:
        print("OBSERVING: %s" % dir)
        observer.schedule(
            handler,
            dir,
            recursive=False,
        )
    observer.start()

    print("OBSERVER STARTED")
    if join:
        observer.join()
