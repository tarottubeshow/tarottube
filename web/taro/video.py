import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *

@APP.route('/video/latest.mp4')
def replay():
    timeslot, playlist = Timeslot.latestWithRecording()
    if playlist is None:
        flask.abort(404)

    path = playlist.getPublicUri()
    return flask.redirect(path)
