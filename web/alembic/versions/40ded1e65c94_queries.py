"""queries

Revision ID: 40ded1e65c94
Revises: 6cbfc8b2bbcd
Create Date: 2018-01-24 17:44:09.950955

"""

# revision identifiers, used by Alembic.
revision = '40ded1e65c94'
down_revision = '6cbfc8b2bbcd'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'reading_request',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('created', sa.DateTime),
        sa.Column('name', sa.String),
        sa.Column('question', sa.Text),
    )


def downgrade():
    pass
