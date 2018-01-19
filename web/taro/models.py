import datetime
import uuid
import yaml

import sqlalchemy as sa
import sqlalchemy.orm as sao

from taro import firebase
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
    duration = sa.Column('duration', sa.Integer)
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
            timeslot.duration = self.duration
            timeslot.unique_key = time['key']
            timeslot.schedule = self
            timeslot.put()

    def getJson(self):
        return {
            'id': self.id,
            'name': self.name,
            'duration': self.duration,
            'spec': self.spec,
        }

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
    duration = sa.Column('duration', sa.Integer)
    end_time = sa.Column('end_time', sa.DateTime)
    name = sa.Column('name', sa.String)
    secret_key = sa.Column('secret_key', sa.String)
    stream_key = sa.Column('stream_key', sa.String)
    time = sa.Column('time', sa.DateTime)
    unique_key = sa.Column('unique_key', sa.String)

    schedule_id = sa.Column('schedule_id', sa.Integer,
        sa.ForeignKey('schedule.id'))
    schedule = sao.relationship('Schedule')

    @classmethod
    def forStreamKey(self, key):
        return Timeslot.query()\
            .filter(Timeslot.stream_key == key)\
            .first()

    @classmethod
    def new(self):
        return Timeslot(
            time=datetime.datetime.now() + datetime.timedelta(hours=1),
            duration=30,
            secret_key=str(uuid.uuid4()),
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

    def getJson(self):
        return {
            'id': self.id,
            'duration': self.duration,
            'time': str(self.time),
            'end_time': str(self.end_time),
            'name': self.name,
            'stream_key': self.stream_key,
            'unique_key': self.unique_key,
            'schedule': self.schedule.getJson() if self.schedule else None,
        }

    def onSync(self):
        self.end_time = self.time + datetime.timedelta(minutes=self.duration)
        fbdb = firebase.getShard()
        fbdb.child("timeslots").child(self.stream_key).set(self.getJson())

    def putPlaylist(self, type, quality, value):
        playlist = TimeslotPlaylist.get(self, quality, type)
        playlist.payload = value

    def urlAdmin(self):
        return '/admin/timeslots/%s/' % (self.id or 'new')

@sa.event.listens_for(Timeslot, 'before_insert')
@sa.event.listens_for(Timeslot, 'before_update')
def onTimeslotSync(mapper, connection, target):
    target.onSync()

class TimeslotEvent(sqla.BaseModel):

    __tablename__ = 'timeslot_event'

    id = sa.Column('id', sa.Integer, primary_key=True)
    payload = sa.Column('payload', sa.PickleType())
    time = sa.Column('time', sa.DateTime)
    type = sa.Column('type', sa.String)
    quality = sa.Column('quality', sa.String)

    timeslot_id = sa.Column('timeslot_id', sa.Integer,
        sa.ForeignKey('timeslot.id'))
    timeslot = sao.relationship('Timeslot')

    @classmethod
    def forTimeslot(self, timeslot):
        return TimeslotEvent.query()\
            .filter(TimeslotEvent.timeslot == timeslot)\
            .order_by(TimeslotEvent.time.desc())\
            .all()

class TimeslotPlaylist(sqla.BaseModel):

    __tablename__ = 'timeslot_playlist'

    id = sa.Column('id', sa.Integer, primary_key=True)
    quality = sa.Column('quality', sa.String)
    type = sa.Column('type', sa.String)
    payload = sa.Column('payload', sa.PickleType)

    timeslot_id = sa.Column('timeslot_id', sa.Integer,
        sa.ForeignKey('timeslot.id'))
    timeslot = sao.relationship('Timeslot')

    @classmethod
    def get(cls, timeslot, quality, type, create=True):
        existing = TimeslotPlaylist.query()\
            .filter(TimeslotPlaylist.timeslot == timeslot)\
            .filter(TimeslotPlaylist.quality == quality)\
            .filter(TimeslotPlaylist.type == type)\
            .first()
        if existing:
            return existing

        if create:
            playlist = TimeslotPlaylist(
                timeslot=timeslot,
                quality=quality,
                type=type,
            )
            playlist.put()
            return playlist

    def onSync(self):
        fbdb = firebase.getShard()
        key = '%s:%s:%s' % (
            self.timeslot.stream_key,
            self.type,
            self.quality,
        )
        fbdb.child("playlists")\
            .child(key)\
            .set(self.getJson())

    def getJson(self):
        return {
            'stream': self.timeslot.stream_key,
            'type': self.type,
            'quality': self.quality,
            'payload': self.payload,
        }

@sa.event.listens_for(TimeslotPlaylist, 'before_insert')
@sa.event.listens_for(TimeslotPlaylist, 'before_update')
def onTimeslotPlaylistSync(mapper, connection, target):
    target.onSync()
