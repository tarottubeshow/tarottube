"""delete the db

Revision ID: dc44a9a046fb
Revises: 9920d3b2496f
Create Date: 2018-01-16 19:13:22.184443

"""

# revision identifiers, used by Alembic.
revision = 'dc44a9a046fb'
down_revision = '9920d3b2496f'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.execute("""TRUNCATE timeslot, timeslot_event, timeslot_playlist""")


def downgrade():
    pass
