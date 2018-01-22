import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro import sqla
from taro.app import APP
from taro.models import *

@APP.route('/admin/')
def adminRoot():
    timeslots = Timeslot.queryUpcoming()\
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
    schedule.duration = rval.get('duration', val.ParseInt(), val.Required())
    schedule.spec = rval.get('spec', val.Required())
    schedule.put(True)

    if rval.get('regenerate', val.ParseBool()) or (id == 'new'):
        schedule.generateTimeslots(force=True)

    return flask.redirect(schedule.urlAdmin())

def _getSchedule(id):
    if id == 'new':
        return Schedule(
            duration=30,
            spec=DEFAULT_SCHEDULE_SPEC,
        )
    else:
        return Schedule.forId(int(id))

@APP.route('/admin/timeslots/<id>/')
def getTimeslot(id):
    timeslot = _getTimeslot(id)
    events = TimeslotEvent.forTimeslot(timeslot)
    return flask.render_template(
        'admin/timeslot.jinja2',
        title="Edit Timeslot",
        timeslot=timeslot,
        breadcrumbs=timeslot.breadcrumbs(),
        events=events,
    )

@APP.route('/admin/timeslots/<id>/', methods=['POST'])
def saveTimeslot(id):
    timeslot = _getTimeslot(id)
    timeslot.deprecated = rval.get(
        'deprecated',
        val.ParseBool(),
        val.DefaultValue(False),
    )
    timeslot.name = rval.get('name', val.Required())
    timeslot.time = rval.get(
        'time',
        val.ParseDateTime(),
        val.Required(),
    )
    timeslot.duration = rval.get(
        'duration',
        val.ParseInt(),
        val.Required(),
    )
    timeslot.stream_key = rval.get('stream_key')
    timeslot.secret_key = rval.get('secret_key')
    timeslot.put(True)
    return flask.redirect(timeslot.urlAdmin())

@APP.route('/admin/broadcast-notification/<id>/', methods=['POST'])
def broadcastNotification(id):
    message = rval.get('message', val.Required())
    timeslot = Timeslot.forId(id)
    counts = PushToken.broadcast(message)
    TimeslotEvent(
        timeslot=timeslot,
        time=datetime.datetime.now(),
        quality=None,
        type='notify',
        payload={
            'counts': counts,
            'message': message,
        },
    ).put()
    return flask.redirect(timeslot.urlAdmin())

@APP.route('/admin/deprecated-timeslots/')
def deprecatedTimeslots():
    query = Timeslot.queryDeprecated()
    page = sqla.paginate(query)
    return flask.render_template(
        'admin/pastTimeslots.jinja2',
        deprecated=True,
        title="Deprecated Timeslots",
        page=page,
        breadcrumbs=DEPRECATED_TIMESLOTS_BREADCRUMBS,
    )

@APP.route('/admin/past-timeslots/')
def pastTimeslots():
    query = Timeslot.queryPast()
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

DEFAULT_SCHEDULE_SPEC = """
type: daily
time: "09:00"
""".strip()

def syncActiveRecord(key):
    print("Examining key: %s" % key)
    timeslot = Timeslot.forStreamKey(key)
    if not timeslot:
        return

    print("Syncing")
    timeslot.syncToFirebase()

@APP.route('/admin/test')
def test():
    fbdb = firebase.getShard()
    data = fbdb.child('timeslots').get().val()
    if not data:
        return

    for key in data.keys():
        syncActiveRecord(key)

    return "OK"
