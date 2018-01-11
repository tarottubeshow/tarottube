"""add timeslot secret

Revision ID: 72db3637a38b
Revises: 66541491f6c6
Create Date: 2018-01-11 16:38:38.162849

"""

# revision identifiers, used by Alembic.
revision = '72db3637a38b'
down_revision = '66541491f6c6'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot', sa.Column('secret_key', sa.String))


def downgrade():
    pass
