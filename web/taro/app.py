from flask import Flask
APP = Flask(__name__)

@APP.route('/')
def root():
    return 'Hello, Worldy!'
