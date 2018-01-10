import flask

from taro.app import APP
from taro import sqla

@APP.route('/admin/')
def adminRoot():
    result = sqla.BaseModel.execute("""SELECT 'HELLO WORLD'""")
    for x in result:
        print(x)
    return flask.render_template(
        'admin/root.jinja2',
        title="Admin Home"
    )
