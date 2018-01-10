import flask
import logging

from taro.validate import Validator

def _combinedValues():
    values = {}
    values.update(flask.request.values.to_dict())
    if flask.request.is_json:
        jsonValues = flask.request.get_json(silent=True)
        if jsonValues:
            values.update(jsonValues)
    return values

def get(key, *validators):
    """
        Get a validated result from the flask request.
    """
    values = _combinedValues()
    value = values.get(key)
    if value == 'None':
        value = None
    try:
        return Validator.applyValidators(value, validators)
    except Exception as e:
        logging.error("400: %s (%s): '%s'" % (key, e, value))
        flask.abort(400, "%s: %s" % (key, e))

def getMulti(key, *validators):
    values = flask.request.values.getlist(key)
    try:
        return [
            Validator.applyValidators(value, validators)
            for value
            in values
        ]
    except:
        logging.error("400: %s: '%s'" % (key, value))
        flask.abort(400)
