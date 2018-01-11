"""add timeslot event level

Revision ID: a9938c120ebe
Revises: af76c349f055
Create Date: 2018-01-11 16:12:36.681029

"""

# revision identifiers, used by Alembic.
revision = 'a9938c120ebe'
down_revision = 'af76c349f055'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot_event', sa.Column('quality', sa.String))


def downgrade():
    pass
