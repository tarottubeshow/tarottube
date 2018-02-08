import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *

@APP.route('/video/intro.mp4')
def intro():
    return flask.redirect('/resource/intro_vid.mp4')
