"""add duration to timeslot

Revision ID: 728178143e77
Revises: b4f9fa97bc01
Create Date: 2018-01-12 10:44:39.406259

"""

# revision identifiers, used by Alembic.
revision = '728178143e77'
down_revision = 'b4f9fa97bc01'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot', sa.Column('duration', sa.Integer))
    op.execute("""
        UPDATE timeslot
        SET duration = 30
    """)


def downgrade():
    pass
