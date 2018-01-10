import sqlalchemy as sa
import sqlalchemy.orm as sao

from taro import sqla

class Schedule(sqla.BaseModel):

    __tablename__ = 'schedule'

    id = sa.Column('id', sa.Integer, primary_key=True)
    name = sa.Column('name', sa.String)
    spec = sa.Column('spec', sa.Text)
    deprecated = sa.Column('deprecated', sa.Boolean)

    def urlAdmin(self):
        return '/admin/schedules/%s/' % (self.id)

class Timeslot(sqla.BaseModel):

    __tablename__ = 'timeslot'

    id = sa.Column('id', sa.Integer, primary_key=True)
    time = sa.Column('time', sa.DateTime)
    unique_key = sa.Column('unique_key', sa.String)
    stream_key = sa.Column('stream_key', sa.String)

    schedule_id = sa.Column('schedule_id', sa.Integer,
        sa.ForeignKey('schedule.id'))
    schedule = sao.relationship('Schedule')
