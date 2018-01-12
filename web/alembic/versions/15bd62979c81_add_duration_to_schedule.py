"""add duration to schedule

Revision ID: 15bd62979c81
Revises: 9c142f7ce3cd
Create Date: 2018-01-12 10:54:55.810979

"""

# revision identifiers, used by Alembic.
revision = '15bd62979c81'
down_revision = '9c142f7ce3cd'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('schedule', sa.Column('duration', sa.Integer))
    op.execute("""
        UPDATE schedule
        SET duration = 30
    """)


def downgrade():
    pass
