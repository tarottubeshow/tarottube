"""add timeslot events

Revision ID: 13a3565bb734
Revises: 450e34de33c3
Create Date: 2018-01-11 15:59:32.009698

"""

# revision identifiers, used by Alembic.
revision = '13a3565bb734'
down_revision = '450e34de33c3'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'timeslot_event',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('payload', sa.PickleType()),
        sa.Column('timeslot_id', sa.Integer, sa.ForeignKey('timeslot.id')),
    )


def downgrade():
    pass
