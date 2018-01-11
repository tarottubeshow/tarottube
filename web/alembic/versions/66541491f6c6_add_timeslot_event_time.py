"""add timeslot event time

Revision ID: 66541491f6c6
Revises: a9938c120ebe
Create Date: 2018-01-11 16:25:09.870599

"""

# revision identifiers, used by Alembic.
revision = '66541491f6c6'
down_revision = 'a9938c120ebe'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot_event', sa.Column('time', sa.DateTime))
    op.add_column('timeslot_event', sa.Column('type', sa.String))


def downgrade():
    pass
