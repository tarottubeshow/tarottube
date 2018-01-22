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
        'root.jinja2',
    )

@APP.route('/video/latest.mp4')
def replay():
    timeslot, playlist = Timeslot.latestWithRecording()
    if playlist is None:
        flask.abort(404)

    path = playlist.payload['path'].replace('.flv', '.mp4')
    return flask.redirect('/frags/flv/%s' % path)

@APP.route('/api/2/notifications/subscribe.json', methods=['POST'])
def subscribeToNotifications():
    payload = flask.request.get_json()
    token = PushToken.subscribe(payload['token'])
    return flask.jsonify({
        'status': "OK",
    })
