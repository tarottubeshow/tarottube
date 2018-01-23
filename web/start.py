import datetime
import os
import subprocess
import time
from jinja2 import Template

from taro import sqla
from taro import starting
from taro.config import CONFIG

NGINX_CONF = CONFIG['nginx']
UWSGI_CONF = CONFIG['uwsgi']
RESOURCE_DIR = '/opt/repo/web/resource'
FRAGS_DIR = '/opt/mount/frags'

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
            '--disable-sendfile',
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

if __name__ == '__main__':
    starting.waitForPsql()
    runMigrations()
    startAll()
