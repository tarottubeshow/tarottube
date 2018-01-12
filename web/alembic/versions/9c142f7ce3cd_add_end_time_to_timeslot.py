"""add end_time to timeslot

Revision ID: 9c142f7ce3cd
Revises: 728178143e77
Create Date: 2018-01-12 10:49:32.920941

"""

# revision identifiers, used by Alembic.
revision = '9c142f7ce3cd'
down_revision = '728178143e77'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot', sa.Column('end_time', sa.DateTime))
    op.execute("""
        UPDATE timeslot
        SET end_time = time + INTERVAL '30 minutes'
    """)
    op.execute("""
        CREATE INDEX ON timeslot (end_time)
    """)


def downgrade():
    pass
