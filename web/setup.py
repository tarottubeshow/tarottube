from setuptools import setup, find_packages
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

setup(
    name='tarottube',
    version='0.0.0',

    description="""It's Tarot Tube, Dammit""",
    long_description="This is really Tarot Tube, dammit!",

    url='http://www.tarottube.com',

    author='Tarot Tube Team',
    author_email='tarottubeshow@gmail.com',

    license='GNU Lesser 3',

    packages=[
        'taro'
    ],

    install_requires=[
        'flask',
        'pyyaml',
        'SQLAlchemy',
        'psycopg2',
        'alembic',
        'tzlocal',
        'pytz',
        'pyrebase',
        'requests',
        'watchdog',
        'exponent_server_sdk',
        'googleapis-common-protos',
        'google-cloud==0.32.0',
        'urllib3==1.26.5',
        'stripe',
    ],
)
