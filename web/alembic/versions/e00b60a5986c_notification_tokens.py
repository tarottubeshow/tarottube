"""notification tokens

Revision ID: e00b60a5986c
Revises: 607853372527
Create Date: 2018-01-22 14:11:52.137336

"""

# revision identifiers, used by Alembic.
revision = 'e00b60a5986c'
down_revision = '607853372527'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.drop_table('push_token')
    op.create_table(
        'push_token',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('active', sa.Boolean),
        sa.Column('created', sa.DateTime),
        sa.Column('token', sa.String),
    )


def downgrade():
    pass
