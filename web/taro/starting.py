import time

from taro import sqla

def waitForPsql():
    while True:
        print("ATTEMPTING A SQL QUERY")
        with sqla.BaseModel.sessionContext():
            try:
                result = sqla.BaseModel.execute("""SELECT 1""")
                print(list(result))
                return
            except:
                print("Exception encountered querying... sleeping")
                time.sleep(1)
