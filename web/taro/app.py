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

try:
    init()
except:
    import traceback
    print("EXCEPTION OCCURRED INITIALIZING APP!")
    print(traceback.format_exc())
