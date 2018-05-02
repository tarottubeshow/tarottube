import datetime
import flask
import stripe

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *
from taro import config

STRIPE = config.CONFIG['stripe']
stripe.api_key = STRIPE['secret']

@APP.route('/')
def root():
    return flask.render_template(
        'root.jinja2',
    )

@APP.route('/private-readings/')
def privateReadings():
    return flask.render_template(
        'privateReadings.jinja2',
    )

@APP.route('/charge-reading.json', methods=["POST"])
def chargeReading():
    data = flask.request.get_json()
    stripe.Charge.create(
      amount=data['amount'],
      currency="usd",
      source=data['token'],
      description="Tarot Reading",
    )
    return flask.jsonify({
        'status': "OK",
    })
