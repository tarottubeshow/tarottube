import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro import firebase
from taro.app import APP
from taro.models import *

@APP.route('/')
def root():
    return flask.render_template(
        'player.jinja2',
        url=CONFIG['url'],
        name=flask.request.values.get('name'),
    )

@APP.route('/test/')
def test():
    fbdb = firebase.get()
    result = fbdb.child('test').get()
    print(result.val())
    return "OK"
