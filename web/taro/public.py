import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *
from taro.config import CONFIG

@APP.route('/')
def root():
    return flask.render_template(
        'player.jinja2',
        url=CONFIG['url'],
        name=flask.request.values.get('name'),
    )
