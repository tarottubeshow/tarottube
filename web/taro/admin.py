import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro import sqla
from taro.app import APP
from taro.models import *

@APP.route('/admin/')
def adminRoot():
    timeslots = Timeslot.query()\
        .filter(Timeslot.time > datetime.datetime.now())\
        .order_by(Timeslot.time)\
        .limit(20)\
        .all()
    return flask.render_template(
        'admin/root.jinja2',
        title="Admin Home",
        timeslots=timeslots,
        breadcrumbs=ADMIN_BREADCRUMBS,
    )

@APP.route('/admin/schedules/')
def listSchedules():
    schedules = Schedule.query().all()
    return flask.render_template(
        'admin/schedules.jinja2',
        title="Schedules",
        schedules=schedules,
        breadcrumbs=SCHEDULES_BREADCRUMBS,
    )

@APP.route('/admin/schedules/<id>/')
def getSchedule(id):
    schedule = _getSchedule(id)
    return flask.render_template(
        'admin/schedule.jinja2',
        title="Edit Schedule",
        schedule=schedule,
        breadcrumbs=schedule.breadcrumbs(),
    )

@APP.route('/admin/schedules/<id>/', methods=['POST'])
def saveSchedule(id):
    schedule = _getSchedule(id)
    schedule.name = rval.get('name', val.Required())
    schedule.spec = rval.get('spec', val.Required())
    schedule.put(True)

    if rval.get('regenerate', val.ParseBool()) or (id == 'new'):
        schedule.generateTimeslots(force=True)

    return flask.redirect(schedule.urlAdmin())

def _getSchedule(id):
    if id == 'new':
        return Schedule()
    else:
        return Schedule.forId(int(id))

@APP.route('/admin/timeslots/<id>/')
def getTimeslot(id):
    timeslot = _getTimeslot(id)
    return flask.render_template(
        'admin/timeslot.jinja2',
        title="Edit Timeslot",
        timeslot=timeslot,
        breadcrumbs=timeslot.breadcrumbs(),
    )

@APP.route('/admin/timeslots/<id>/', methods=['POST'])
def saveTimeslot(id):
    timeslot = _getTimeslot(id)
    timeslot.name = rval.get('name', val.Required())
    timeslot.time = rval.get(
        'time',
        val.ParseDateTime(),
        val.Required(),
    )
    timeslot.stream_key = rval.get('stream_key')
    timeslot.put(True)
    return flask.redirect(timeslot.urlAdmin())

@APP.route('/admin/past-timeslots/')
def pastTimeslots():
    query = Timeslot.query()\
        .filter(Timeslot.time < datetime.datetime.now())\
        .order_by(Timeslot.time.desc())
    page = sqla.paginate(query)
    return flask.render_template(
        'admin/pastTimeslots.jinja2',
        title="Past Timeslots",
        page=page,
        breadcrumbs=PAST_TIMESLOTS_BREADCRUMBS,
    )

def _getTimeslot(id):
    if id == 'new':
        return Timeslot.new()
    else:
        return Timeslot.forId(int(id))
