from taro.config import CONFIG

def isDev():
    return CONFIG['ENV'] == 'dev'

def gitCommit():
    # TODO: how to access?
    return "1"
