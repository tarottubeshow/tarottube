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
    query = Timeslot.query()\
        .filter(Timeslot.time < datetime.datetime.now())\
        .order_by(Timeslot.time.desc())
    for timeslot in query:
        playlist = TimeslotPlaylist.get(timeslot, 'high', 'flv', create=False)
        if playlist:
            path = playlist.payload['path'].replace('.flv', '.mp4')
            return flask.redirect('/frags/flv/%s' % path)

    flask.abort(404)
