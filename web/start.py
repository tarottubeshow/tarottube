import datetime
import os
import subprocess
from jinja2 import Template
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler, FileSystemEventHandler

from taro import sqla
from taro.config import CONFIG
from taro.models import *

NGINX_CONF = CONFIG['nginx']
UWSGI_CONF = CONFIG['uwsgi']
RESOURCE_DIR = '/opt/repo/web/resource'
FRAGS_DIR = '/opt/mount/frags'
DEBOUNCE_CUTOFF = datetime.timedelta(seconds=3)

def getUwsgiArgs():
    args = [
        'uwsgi',
        '--master',
        '--module', 'taro.app:APP',
        '--enable-threads',
    ]

    args += [
        '--workers', str(UWSGI_CONF['workers']),
    ]

    if UWSGI_CONF['watchFiles']:
        args += [
            '--py-autoreload', '1',
            '--worker-reload-mercy', '0',
        ]

    if UWSGI_CONF['mode'] == 'local':
        args += [
            '--http', ':80',
            '--static-map', ('/resource=%s' % RESOURCE_DIR),
            '--static-map', ('/frags=%s' % FRAGS_DIR),
            '--static-safe', '/opt/repo',
        ]
    elif UWSGI_CONF['mode'] == 'nginx':
        args += [
            '--socket', '127.0.0.1:4040',
        ]

    return args

def runMigrations():
    print("HEY IM RUNNING MIGRATIONS NOW, COOL?")
    subprocess.check_call(
        ['/usr/local/bin/alembic', 'upgrade', 'head'],
        cwd='/opt/repo/web',
    )

def startAll():
    print(UWSGI_CONF['mode'])
    if UWSGI_CONF['mode'] == 'nginx':
        startNginx()

    startUwsgi()

def startNginx():
    with open('/opt/repo/web/nginx/nginx.conf') as f:
        template = Template(f.read())

    conf = template.render(
        conf=NGINX_CONF,
        resourceDir=RESOURCE_DIR,
    )
    print(conf)

    with open('/etc/nginx/nginx.conf', 'w') as f:
        f.write(conf)

    subprocess.check_call(['service', 'nginx', 'start'])

def startUwsgi():
    uwsgiArgs = getUwsgiArgs()
    print(uwsgiArgs)
    subprocess.check_call(uwsgiArgs)

def startFragmentWatcher():

    class Handler(FileSystemEventHandler):

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

    observer = Observer()
    observer.schedule(
        Handler(),
        '/opt/mount/frags/hls',
        recursive=False,
    )
    observer.start()

    print("OBSERVER STARTED")

def waitForPsql():
    subprocess.check_call([
        '/opt/repo/web/wait-for-it.sh',
        'taro-db:5432',
        '--',
        'echo',
        'DONE',
    ])

if __name__ == '__main__':
    waitForPsql()
    runMigrations()
    startFragmentWatcher()
    startAll()
