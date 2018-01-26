import datetime
import flask

import taro.validate as val
import taro.requestValidate as rval
from taro import firebase
from taro import sqla
from taro import upload
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

# schedules

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

# timeslots

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

# faq

@APP.route('/admin/faq/')
def listFaqs():
    faqs = Faq.getAll()
    return flask.render_template(
        'admin/faqs.jinja2',
        title="FAQs",
        faqs=faqs,
        breadcrumbs=FAQ_BREADCRUMBS,
    )

@APP.route('/admin/faq/<id>/')
def getFaq(id):
    faq = _getFaq(id)
    return flask.render_template(
        'admin/faq.jinja2',
        title="Edit FAQ",
        faq=faq,
        breadcrumbs=faq.breadcrumbs(),
    )

@APP.route('/admin/faq/<id>/', methods=['POST'])
def saveFaq(id):
    faq = _getFaq(id)
    faq.deprecated = rval.get('deprecated', val.ParseBool(), val.DefaultValue(False))
    faq.title = rval.get('title', val.Required())
    faq.order = rval.get('order', val.Required())

    if upload.fileExists():
        print("upload")
        uploaded = upload.uploadFromRequest()
        print(uploaded)
        faq.url = uploaded['url']

    faq.put(True)
    return flask.redirect(faq.urlAdmin())

def _getFaq(id):
    if id == 'new':
        return Faq(
            deprecated=False,
        )
    else:
        return Faq.forId(int(id))

# reading requests

@APP.route('/admin/reading-requests/')
def listReadingRequests():
    requests = ReadingRequest.query()\
        .order_by(ReadingRequest.created.desc())
    page = sqla.paginate(requests)
    return flask.render_template(
        'admin/readingRequests.jinja2',
        title="Reading Requests",
        requests=page,
        breadcrumbs=READING_REQUESTS_BREADCRUMBS,
    )

@APP.route('/admin/reading-requests/<int:id>/')
def getReadingRequest(id):
    request = ReadingRequest.forId(id)
    return flask.render_template(
        'admin/readingRequest.jinja2',
        title="Reading Request: %s" % request.name,
        request=request,
        breadcrumbs=request.breadcrumbs(),
    )

DEFAULT_SCHEDULE_SPEC = """
type: daily
time: "09:00"
""".strip()
