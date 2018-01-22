"""notification tokens

Revision ID: 607853372527
Revises: 28c30856ce67
Create Date: 2018-01-22 14:02:57.529431

"""

# revision identifiers, used by Alembic.
revision = '607853372527'
down_revision = '28c30856ce67'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'push_token',
        sa.Column('active', sa.Boolean),
        sa.Column('created', sa.DateTime),
        sa.Column('token', sa.String),
    )

def downgrade():
    pass
