"""views

Revision ID: 53c1323a0826
Revises: 40ded1e65c94
Create Date: 2018-02-08 15:43:40.774778

"""

# revision identifiers, used by Alembic.
revision = '53c1323a0826'
down_revision = '40ded1e65c94'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'timeslot_view',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('type', sa.String),
        sa.Column('uuid', sa.String),
        sa.Column('timeslot_id', sa.Integer,
            sa.ForeignKey('timeslot.id')),
        sa.Column('created', sa.DateTime),
        sa.Column('last', sa.DateTime),
    )
    op.execute("""
        CREATE UNIQUE INDEX ON timeslot_view (timeslot_id, type, uuid)
    """)


def downgrade():
    pass
