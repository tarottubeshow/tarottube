import os
import subprocess
from jinja2 import Template

from taro.config import CONFIG

NGINX_CONF = CONFIG['nginx']
UWSGI_CONF = CONFIG['uwsgi']

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
        ]

    if UWSGI_CONF['mode'] == 'local':
        args += [
            '--http', ':80',
        ]
    elif UWSGI_CONF['mode'] == 'nginx':
        args += [
            '--socket', '127.0.0.1:4040',
        ]

    return args

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
    startAll()
