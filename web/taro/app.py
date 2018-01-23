import flask

APP = flask.Flask(__name__)

def init():
    import jinja2

    from taro.config import CONFIG
    from taro.util import metautil

    import taro.templating

    APP.jinja_env = jinja2.Environment(
        loader = jinja2.FileSystemLoader([
            '/opt/repo/web/templates',
        ]),
        cache_size=0 if metautil.isDev() else 400,
    )
    APP.jinja_env.globals.update(taro.templating.GLOBALS)

    import taro.admin
    import taro.hook
    import taro.public
    import taro.video
    import taro.api

    import taro.sqla
    taro.sqla.augmentApp(APP)

    from taro.util import metautil
    if not metautil.isDev():
        forceSsl(APP)

def forceSsl(app):
    @app.before_request
    def redirectNonSSl():
        isGet = (flask.request.method == 'GET')
        isSecure = flask.request.is_secure
        if (isGet) and (not isSecure):
            redirect = flask.request.url.replace("http://", "https://")
            return flask.redirect(
                redirect,
                code=301,
            )

    @app.after_request
    def setHstsPolicy(response):
        isSecure = flask.request.is_secure
        if flask.request.is_secure:
            if isinstance(response, flask.Response):
                response.headers['Strict-Transport-Security'] = "max-age=31536000"
        return response

try:
    init()
except:
    import traceback
    print("EXCEPTION OCCURRED INITIALIZING APP!")
    print(traceback.format_exc())
