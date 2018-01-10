"""create schedule table

Revision ID: c3bf44946674
Revises: b827b493e7f4
Create Date: 2018-01-09 21:32:34.260196

"""

# revision identifiers, used by Alembic.
revision = 'c3bf44946674'
down_revision = 'b827b493e7f4'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'schedule',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String),
        sa.Column('spec', sa.Text),
        sa.Column('deprecated', sa.Boolean),
    )
    op.create_table(
        'timeslot',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('schedule_id', sa.Integer, sa.ForeignKey('schedule.id')),
        sa.Column('time', sa.DateTime),
        sa.Column('unique_key', sa.String),
        sa.Column('stream_key', sa.String),
    )
    op.execute("""
        CREATE INDEX ON timeslot (time)
    """)


def downgrade():
    pass
