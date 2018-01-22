import pyrebase

from taro.config import CONFIG

def connect():
    config = {
      "apiKey": CONFIG['firebase']['apiKey'],
      "authDomain": CONFIG['firebase']['domain'],
      "databaseURL": CONFIG['firebase']['db'],
      "storageBucket": CONFIG['firebase']['domain'],
      'serviceAccount': "/opt/repo/gsa.json",
    }
    firebase = pyrebase.initialize_app(config)
    db = firebase.database()
    return db

def get():
    if not hasattr(get, '_conn'):
        get._conn = connect()
    return get._conn

def getShard():
    return get().child(CONFIG['firebase']['shard'])
