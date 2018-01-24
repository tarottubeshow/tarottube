import datetime
import flask
import time

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *

@APP.route('/api/2/faq.json')
def getFaqs():
    faqs = [
        faq.getJson()
        for faq
        in Faq.getAll(False)
    ]
    return flask.jsonify({
        'status': "OK",
        'faqs': faqs,
    })


@APP.route('/api/2/notifications/subscribe.json', methods=['POST'])
def subscribeToNotifications():
    payload = flask.request.get_json()
    token = PushToken.subscribe(payload['token'])
    return flask.jsonify({
        'status': "OK",
    })
