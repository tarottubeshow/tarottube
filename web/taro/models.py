import datetime
import uuid
import yaml

import sqlalchemy as sa
import sqlalchemy.orm as sao

from taro import sqla
from taro.util import timeutil

ADMIN_BREADCRUMBS = [
    ('/', "Tarot Tube"),
    ('/admin/', "Admin"),
]

SCHEDULES_BREADCRUMBS = ADMIN_BREADCRUMBS + [
    ('/admin/schedules/', "Schedules"),
]

PAST_TIMESLOTS_BREADCRUMBS = ADMIN_BREADCRUMBS + [
    ('/admin/past-timeslots/', "Past Timeslots"),
]

class Schedule(sqla.BaseModel):

    __tablename__ = 'schedule'

    id = sa.Column('id', sa.Integer, primary_key=True)
    name = sa.Column('name', sa.String)
    spec = sa.Column('spec', sa.Text)
    deprecated = sa.Column('deprecated', sa.Boolean)

    def breadcrumbs(self):
        return SCHEDULES_BREADCRUMBS + [(
            self.urlAdmin(),
            self.name or "New Schedule",
        )]

    def generateTimeslots(self, force=False):
        for time in self._generateTimes():
            if time['time'] < datetime.datetime.now():
                continue

            timeslot = Timeslot.query()\
                .filter(Timeslot.schedule == self)\
                .filter(Timeslot.unique_key == time['key'])\
                .first()

            if timeslot and (not force):
                continue

            if timeslot is None:
                timeslot = Timeslot.new()

            timeslot.time = time['time']
            timeslot.name = time['name']
            timeslot.unique_key = time['key']
            timeslot.schedule = self
            timeslot.put()

    def urlAdmin(self):
        return '/admin/schedules/%s/' % (self.id or 'new')

    def _generateTimes(self):
        # TODO: expand schedule coverage
        spec = yaml.safe_load(self.spec)
        for i in range(0, 30):
            date = datetime.datetime.now() + datetime.timedelta(days=i)
            day = timeutil.tzTrunc(
                date,
                'day',
                toZone=timeutil.DEFAULT_LOCAL_ZONE,
            )
            key = day.strftime('%Y-%m-%d')
            name = "%s - %s" % (self.name, day.strftime("%A, %B %-d, %Y"))
            time = timeutil.tzConv(
                datetime.datetime.strptime(
                    "%sT%s" % (key, spec['time']),
                    "%Y-%m-%dT%H:%M",
                ),
                timeutil.DEFAULT_LOCAL_ZONE,
                timeutil.DEFAULT_NAIVE_ZONE,
                naive=True,
            )
            yield {
                'key': key,
                'name': name,
                'time': time,
            }

class Timeslot(sqla.BaseModel):

    __tablename__ = 'timeslot'

    id = sa.Column('id', sa.Integer, primary_key=True)
    name = sa.Column('name', sa.String)
    time = sa.Column('time', sa.DateTime)
    unique_key = sa.Column('unique_key', sa.String)
    stream_key = sa.Column('stream_key', sa.String)

    schedule_id = sa.Column('schedule_id', sa.Integer,
        sa.ForeignKey('schedule.id'))
    schedule = sao.relationship('Schedule')

    @classmethod
    def new(self):
        return Timeslot(
            time=datetime.datetime.now() + datetime.timedelta(hours=1),
            stream_key=str(uuid.uuid4()),
        )

    def breadcrumbs(self):
        bc = []
        if self.schedule:
            bc += self.schedule.breadcrumbs()
        else:
            bc += ADMIN_BREADCRUMBS
        if self.time and (self.time < datetime.datetime.now()):
            bc += [(
                '/admin/past-timeslots/',
                "Past Timeslots",
            )]
        bc += [(
            self.urlAdmin(),
            self.name or "New Timeslot",
        )]
        return bc

    def urlAdmin(self):
        return '/admin/timeslots/%s/' % (self.id or 'new')
