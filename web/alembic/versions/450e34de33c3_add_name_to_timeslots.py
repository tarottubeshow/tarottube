"""add name to timeslots

Revision ID: 450e34de33c3
Revises: c3bf44946674
Create Date: 2018-01-10 17:45:34.035776

"""

# revision identifiers, used by Alembic.
revision = '450e34de33c3'
down_revision = 'c3bf44946674'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot', sa.Column('name', sa.String))


def downgrade():
    pass
