"""playlists

Revision ID: 9920d3b2496f
Revises: 15bd62979c81
Create Date: 2018-01-16 15:32:40.890003

"""

# revision identifiers, used by Alembic.
revision = '9920d3b2496f'
down_revision = '15bd62979c81'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.execute("""DELETE FROM timeslot_event""")
    op.execute("""DELETE FROM timeslot""")
    op.drop_column('timeslot', 'playlists')
    op.create_table(
        'timeslot_playlist',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('quality', sa.String),
        sa.Column('type', sa.String),
        sa.Column('payload', sa.PickleType),
        sa.Column('timeslot_id', sa.Integer,
            sa.ForeignKey('timeslot.id')),
    )
    op.execute("""
        CREATE UNIQUE INDEX ON timeslot_playlist (timeslot_id, quality, type)
    """)


def downgrade():
    pass
