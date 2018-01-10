import flask

from taro.app import APP

@APP.route('/admin/')
def adminRoot():
    return flask.render_template('admin/root.jinja2')
