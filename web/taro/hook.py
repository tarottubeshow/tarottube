# /rtmp-hook/publish/
# /rtmp-hook/done/
# /rtmp-hook/update/

import datetime
import flask
from urllib.parse import urlparse, parse_qs

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *
from taro.config import CONFIG

@APP.route('/rtmp-hook/', methods=['POST'])
def onRtmpEvent():
    now = datetime.datetime.now()

    name = rval.get('name', val.Required())
    if name.endswith('_low'):
        name = name[:-4]
        quality = 'low'
    else:
        quality = 'high'

    timeslot = Timeslot.forStreamKey(name)
    if timeslot is None:
        flask.abort(404)

    call = rval.get('call', val.Required())
    if call not in ['publish', 'update_publish', 'publish_done']:
        return "OK"

    handler = HANDLERS[call]
    type, payload = handler(timeslot, quality)

    TimeslotEvent(
        timeslot=timeslot,
        time=now,
        quality=quality,
        type=type,
        payload=payload,
    ).put()
    return "OK"

def handleStart(timeslot, quality):
    if quality == 'high':
        url = rval.get('swfurl')
        parsed = urlparse(url)
        data = parse_qs(parsed.query)
        if data['key'][0] != timeslot.secret_key:
            flask.abort(401)
    else:
        if rval.get('addr') != '127.0.0.1':
            flask.abort(401)

    return 'start', None

def handleUpdate(timeslot, quality):
    return 'update', {
        'time': rval.get('time', val.ParseFloat()),
        'timestamp': rval.get('timestamp', val.ParseFloat()),
    }

def handleDone(timeslot, quality):
    return 'done', None

HANDLERS = {
    'publish': handleStart,
    'update_publish': handleUpdate,
    'publish_done': handleDone,
}
