import datetime
import traceback
import uuid
import yaml
import exponent_server_sdk as expo

import sqlalchemy as sa
import sqlalchemy.orm as sao

from taro import firebase
from taro import sqla
from taro.config import CONFIG
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

DEPRECATED_TIMESLOTS_BREADCRUMBS = ADMIN_BREADCRUMBS + [
    ('/admin/deprecated-timeslots/', "Deprecated Timeslots"),
]

FAQ_BREADCRUMBS = ADMIN_BREADCRUMBS + [
    ('/admin/faq/', "FAQs"),
]

class Faq(sqla.BaseModel):

    __tablename__ = 'faq'

    id = sa.Column('id', sa.Integer, primary_key=True)
    deprecated = sa.Column('deprecated', sa.Boolean)
    title = sa.Column('title', sa.String)
    url = sa.Column('url', sa.String)
    order = sa.Column('order', sa.String)

    @classmethod
    def getAll(cls, includeDeprecated=True):
        query = Faq.query()
        if not includeDeprecated:
            query = query.filter(Faq.deprecated == False)
        query = query.order_by(Faq.order)
        return query.all()

    def breadcrumbs(self):
        return FAQ_BREADCRUMBS + [(
            self.urlAdmin(),
            self.title or "New FAQ",
        )]

    def getJson(self):
        return {
            'id': self.id,
            'order': self.order,
            'title': self.title,
            'url': self.url,
        }

    def urlAdmin(self):
        return '/admin/faq/%s/' % (self.id or 'new')

class PushToken(sqla.BaseModel):

    __tablename__ = 'push_token'

    id = sa.Column('id', sa.Integer, primary_key=True)
    active = sa.Column('active', sa.Boolean)
    created = sa.Column('created', sa.DateTime)
    token = sa.Column('token', sa.String)

    @classmethod
    def broadcast(cls, message):
        # TODO: send to a task queue, probably
        attempts = 0
        success = 0
        failure = 0
        activeTokens = PushToken.query()\
            .filter(PushToken.active == True)
        for token in activeTokens:
            attempts += 1
            succeeded = token.send(message)
            if succeeded:
                success += 1
            else:
                failure += 1

        return {
            'attempts': attempts,
            'success': success,
            'failure': failure,
        }

    @classmethod
    def subscribe(cls, token):
        existing = PushToken.query()\
            .filter(PushToken.token == token)\
            .first()
        if existing:
            existing.active = True
            return existing
        else:
            created = PushToken(
                active=True,
                created=datetime.datetime.now(),
                token=token,
            )
            created.put()
            return created

    def send(self, message):
        print("Sending '%s' to %s" % (message, self.token))

        client = expo.PushClient()
        message = expo.PushMessage(
            to=self.token,
            body=message,
        )
        try:
            response = client.publish(message)
        except:
            print("Exception encountered sending message...")
            traceback.print_exc()
            return False

        try:
            response.validate_response()
        except expo.DeviceNotRegisteredError:
            print("Detected an unregistered device.")
            self.active = False
            return False
        except expo.PushResponseError as exc:
            print("Got some other error...")
            print(exc.push_response._asdict())
            return False

        return True

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
    deprecated = sa.Column('deprecated', sa.Boolean)
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
    def forStreamKey(cls, key):
        return Timeslot.query()\
            .filter(Timeslot.stream_key == key)\
            .first()

    @classmethod
    def latestWithRecording(cls):
        query = Timeslot.query()\
            .filter(Timeslot.deprecated == False)\
            .filter(Timeslot.time < datetime.datetime.now())\
            .order_by(Timeslot.time.desc())
        for timeslot in query:
            playlist = TimeslotPlaylist.get(timeslot, 'high', 'flv', create=False)
            if playlist:
                return timeslot, playlist

        return None, None

    @classmethod
    def new(cls):
        return Timeslot(
            time=datetime.datetime.now() + datetime.timedelta(hours=1),
            duration=30,
            secret_key=str(uuid.uuid4()),
            stream_key=str(uuid.uuid4()),
            deprecated=False,
        )

    @classmethod
    def queryDeprecated(cls):
        return Timeslot.query()\
            .filter(Timeslot.deprecated == True)\
            .order_by(Timeslot.end_time.desc())

    @classmethod
    def queryPast(cls):
        return Timeslot.query()\
        .filter(Timeslot.deprecated == False)\
        .filter(Timeslot.end_time < datetime.datetime.now())\
        .order_by(Timeslot.end_time.desc())

    @classmethod
    def queryUpcoming(cls):
        return Timeslot.query()\
            .filter(Timeslot.deprecated == False)\
            .filter(Timeslot.end_time > datetime.datetime.now())\
            .order_by(Timeslot.end_time)

    def breadcrumbs(self):
        bc = []
        if self.schedule:
            bc += self.schedule.breadcrumbs()
        else:
            bc += ADMIN_BREADCRUMBS
        if self.deprecated:
            bc += [(
                '/admin/deprecated-timeslots/',
                "Deprecated Timeslots",
            )]
        elif self.end_time and (self.end_time < datetime.datetime.now()):
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
            'deprecated': self.deprecated,
            'duration': self.duration,
            'time': str(self.time),
            'end_time': str(self.end_time),
            'name': self.name,
            'stream_key': self.stream_key,
            'unique_key': self.unique_key,
            'schedule': self.schedule.getJson() if self.schedule else None,
        }

    def syncToFirebase(self):
        fbdb = firebase.getShard()
        target = fbdb.child("timeslots").child(self.stream_key)
        if self.deprecated or (self.end_time < datetime.datetime.now()):
            target.remove()
            return True
        else:
            target.set(self.getJson())
            return False

    def putPlaylist(self, type, quality, value):
        playlist = TimeslotPlaylist.get(self, quality, type)
        playlist.payload = value

    def urlAdmin(self):
        return '/admin/timeslots/%s/' % (self.id or 'new')

    def _onSync(self):
        self.end_time = self.time + datetime.timedelta(minutes=self.duration)
        self.syncToFirebase()

@sa.event.listens_for(Timeslot, 'before_insert')
@sa.event.listens_for(Timeslot, 'before_update')
def onTimeslotSync(mapper, connection, target):
    target._onSync()

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
    def forTimeslot(cls, timeslot):
        return TimeslotPlaylist.query()\
            .filter(TimeslotPlaylist.timeslot == timeslot)

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

    def getJson(self):
        return {
            'stream': self.timeslot.stream_key,
            'type': self.type,
            'quality': self.quality,
            'payload': self.payload,
        }

    def getPublicUri(self):
        if self.type != 'flv':
            raise NotImplemented("getPublicUri is only implemented for flv playlists")

        version = self.payload.get('version')

        if version == 1:
            path = self.payload['mp4']
        else: # v0
            path = self.payload['path'].replace('.flv', '.mp4')

        return '%s/flv/%s' % (
            CONFIG['url']['frags'],
            path
        )

    def _getFirebaseKey(self):
        return '%s:%s:%s' % (
            self.timeslot.stream_key,
            self.type,
            self.quality,
        )

    def _onSync(self, remove=False):
        fbdb = firebase.getShard()
        key = sef._getFirebaseKey()
        target = fbdb\
            .child("playlists")\
            .child(key)

        target.set(self.getJson())

@sa.event.listens_for(TimeslotPlaylist, 'before_insert')
@sa.event.listens_for(TimeslotPlaylist, 'before_update')
def onTimeslotPlaylistSync(mapper, connection, target):
    target._onSync()
