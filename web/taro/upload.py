import flask
import os
import uuid
import werkzeug.utils

from taro import gcloud
from taro.config import CONFIG
from taro.util import iterutil

def loadUpload(filename):
    bucket = _bucket()
    blob = bucket.blob(filename)
    return blob.download_as_string()

def loadUploadToFile(filename, file):
    bucket = _bucket()
    blob = bucket.blob(filename)
    blob.download_to_file(file)

def loadUploadToFilename(filename, target):
    bucket = _bucket()
    blob = bucket.blob(filename)
    blob.download_to_filename(target)

def loadUploadToTmpFile(filename):
    target = "/tmp/%s" % (str(uuid.uuid4()))
    loadUploadToFilename(filename, target)
    return target

def fileExists(key='file'):
    print(flask.request.files)

    if key not in flask.request.files:
        return False

    if not flask.request.files[key].filename:
        return False

    return True

def uploadFromFile(
        path,
        extension=None,
        public=False,
    ):
    return _uploadFromPath(
        path=path,
        extension=extension,
        public=public,
    )

def uploadFromRequest(
        key='file',
        public=True,
        multi=False,
    ):
    if not fileExists(key):
        raise FileMissing()

    files = flask.request.files[key]

    if not isinstance(files, list):
        files = [files]

    fileInfos = []
    for file in files:
        fileInfo = _performUpload(
            file=file,
            public=public,
        )
        fileInfos.append(fileInfo)

    if multi:
        return fileInfos
    else:
        return iterutil.first(fileInfos)

def _bucket():
    return gcloud.getBucket()

def _performUpload(file, public=True):
    uniqueString = str(uuid.uuid4())
    localPath = os.path.join('/tmp/', uniqueString)
    file.save(localPath)

    if '.' in file.filename:
        extension = file.filename.rsplit('.', 1)[1]
    else:
        extension = None

    try:
        return _uploadFromPath(
            path=localPath,
            extension=extension,
            original=file.filename,
            public=public,
        )
    finally:
        os.remove(localPath)

def _uploadFromPath(
        path,
        extension=None,
        public=False,
        original=None,
    ):
    bucket = _bucket()

    uniqueString = str(uuid.uuid4())
    if extension:
        filename = werkzeug.utils.secure_filename(
            "%s.%s" % (uniqueString, extension),
        )
    else:
        filename = uniqueString

    blob = bucket.blob(filename)
    blob.upload_from_filename(path)
    if public:
        blob.make_public()

    return {
        'url': blob.public_url,
        'filename': filename,
        'original': original,
    }

class FileMissing(Exception):

    pass

class TmpFileContext(object):

    def __init__(self, filename, bucketName=None):
        self.filename = filename
        self.bucketName = bucketName

    def __enter__(self):
        self.tmpFilename = loadUploadToTmpFile(self.filename, self.bucketName)
        self.tmpFile = open(self.tmpFilename)
        return self.tmpFile

    def __exit__(self, exc, excType, trace):
        self.tmpFile.close()
        os.remove(self.tmpFilename)
