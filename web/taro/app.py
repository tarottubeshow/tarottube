import flask
import jinja2

from taro.config import CONFIG

APP = flask.Flask(__name__)

APP.jinja_env.loader = jinja2.FileSystemLoader([
    '/opt/repo/web/templates',
])

@APP.route('/')
def root():
    return flask.render_template(
        'player.jinja2',
        url=CONFIG['url'],
    )
