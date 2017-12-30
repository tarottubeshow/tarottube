import subprocess

from taro.config import CONFIG

UWSGI_CONF = CONFIG['uwsgi']

args = [
    'uwsgi',
    '--master',
    '--module', 'taro.app:APP',
    '--http', ':9090',
    '--enable-threads',
]

args += [
    '--workers', str(UWSGI_CONF['workers'])
]

if UWSGI_CONF['watchFiles']:
    args += [
        '--py-autoreload', '1',
    ]

subprocess.check_call(args)
