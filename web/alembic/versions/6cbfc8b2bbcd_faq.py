"""faq

Revision ID: 6cbfc8b2bbcd
Revises: e00b60a5986c
Create Date: 2018-01-23 15:04:19.815018

"""

# revision identifiers, used by Alembic.
revision = '6cbfc8b2bbcd'
down_revision = 'e00b60a5986c'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'faq',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('deprecated', sa.Boolean),
        sa.Column('title', sa.String),
        sa.Column('url', sa.String),
        sa.Column('order', sa.String),
    )


def downgrade():
    pass
