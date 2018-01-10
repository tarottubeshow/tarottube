import datetime

import sqlalchemy as sa
import sqlalchemy.orm as sao

from taro import sqla

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
        return ADMIN_BREADCRUMBS + [(
            self.urlAdmin(),
            self.name or "New Schedule",
        )]

    def urlAdmin(self):
        return '/admin/schedules/%s/' % (self.id or 'new')

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
