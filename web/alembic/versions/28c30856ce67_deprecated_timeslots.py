"""deprecated timeslots

Revision ID: 28c30856ce67
Revises: dc44a9a046fb
Create Date: 2018-01-22 11:56:20.236641

"""

# revision identifiers, used by Alembic.
revision = '28c30856ce67'
down_revision = 'dc44a9a046fb'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('timeslot', sa.Column('deprecated', sa.Boolean))
    op.execute("""
        update timeslot
        set deprecated = false
    """)


def downgrade():
    pass
