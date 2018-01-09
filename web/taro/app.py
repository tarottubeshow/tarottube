import flask
import jinja2

from taro.config import CONFIG
from taro.util import metautil

import taro.templating

APP = flask.Flask(__name__)

APP.jinja_env = jinja2.Environment(
    loader = jinja2.FileSystemLoader([
        '/opt/repo/web/templates',
    ]),
    cache_size=0 if metautil.isDev() else 400,
)
APP.jinja_env.globals.update(taro.templating.GLOBALS)

@APP.route('/')
def root():
    return flask.render_template(
        'player.jinja2',
        url=CONFIG['url'],
        name=flask.request.values.get('name'),
    )
