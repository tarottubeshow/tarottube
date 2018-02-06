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
    body = flask.request.get_json()
    now = datetime.datetime.now()

    quality = body['app']
    streamKey = body['stream']

    timeslot = Timeslot.forStreamKey(streamKey)
    if timeslot is None:
        flask.abort(404)

    call = body['action']
    if call not in ['on_publish', 'on_unpublish']:
        return "0"

    handler = HANDLERS[call]
    type, payload = handler(timeslot, body, quality)

    TimeslotEvent(
        timeslot=timeslot,
        time=now,
        quality=quality,
        type=type,
        payload=payload,
    ).put()
    return "0"

def handleStart(timeslot, body, quality):
    if body['vhost'] == '__defaultVhost__':
        url = body['tcUrl']
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        secretKey = params['key'][0]
        if secretKey != timeslot.secret_key:
            flask.abort(401)
        if timeslot.end_time < datetime.datetime.now():
            flask.abort(403)
    else:
        ip = body['ip']
        if ip != '127.0.0.1':
            flask.abort(401)

    timeslot.putPlaylist('rtmp', quality, {
        'streaming': True,
    })

    return 'start', None

def handleDone(timeslot, body, quality):
    timeslot.putPlaylist('rtmp', quality, {
        'streaming': False,
    })

    return 'done', None

HANDLERS = {
    'on_publish': handleStart,
    'on_unpublish': handleDone,
}
