import flask

import taro.validate as val
import taro.requestValidate as rval
from taro.app import APP
from taro.models import *

@APP.route('/admin/')
def adminRoot():
    return flask.render_template(
        'admin/root.jinja2',
        title="Admin Home"
    )

@APP.route('/admin/schedules/')
def listSchedules():
    schedules = Schedule.query().all()
    return flask.render_template(
        'admin/schedules.jinja2',
        title="Schedules",
        schedules=schedules,
    )

@APP.route('/admin/schedules/<id>/')
def getSchedule(id):
    schedule = _getSchedule(id)
    return flask.render_template(
        'admin/schedule.jinja2',
        title="Edit Schedule",
        schedule=schedule,
    )

@APP.route('/admin/schedules/<id>/', methods=['POST'])
def saveSchedule(id):
    schedule = _getSchedule(id)
    schedule.name = rval.get('name', val.Required())
    schedule.put(True)
    return flask.redirect(schedule.urlAdmin())

def _getSchedule(id):
    if id == 'new':
        return Schedule()
    else:
        return Schedule.forId(int(id))
