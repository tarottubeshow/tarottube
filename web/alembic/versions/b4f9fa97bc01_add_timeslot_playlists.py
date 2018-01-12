"""add timeslot playlists

Revision ID: b4f9fa97bc01
Revises: 72db3637a38b
Create Date: 2018-01-11 19:03:50.946652

"""

# revision identifiers, used by Alembic.
revision = 'b4f9fa97bc01'
down_revision = '72db3637a38b'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot', sa.Column('playlists', sa.PickleType))


def downgrade():
    pass
