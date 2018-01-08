from taro.config import CONFIG
from taro.util import metautil

def resource(path, external=False):
    if external:
        base = "%s://%s%s" % (
            CONFIG['url']['protocol'],
            CONFIG['url']['domain'],
            CONFIG['url']['resource'],
        )
    else:
        base = CONFIG['url']['resource']
    if path.startswith('/'):
        path = path[1:]
    return base + path

def versioned(file):
    versionId = metautil.gitCommit()
    return resource("%s?version=%s" % (file, versionId))

GLOBALS = {
    'resource': resource,
    'versioned': versioned,
}
