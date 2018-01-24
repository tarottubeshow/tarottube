import google.cloud

from google.cloud import storage
from google.oauth2 import service_account

from taro.config import CONFIG

def getAccount():
    account = service_account.Credentials\
        .from_service_account_info(CONFIG['gcloud'])
    return account

def getBucket():
    account = getAccount()
    client = storage.Client(
        CONFIG['gcloud']['project_id'],
        credentials=account,
    )
    bucket = client.get_bucket(CONFIG['gcs_bucket'])
    return bucket
