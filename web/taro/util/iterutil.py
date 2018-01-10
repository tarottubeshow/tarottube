import itertools
import time

from math import ceil

from collections import MutableMapping as DictMixin

def first(lst):
    if lst:
        return lst[0]

def coalesce(*lst):
    for item in lst:
        if item is not None:
            return item

def combine(lsts):
    # TODO: this sux
    result = []
    for lst in lsts:
        if lst:
            result += lst
    return result

def chunk(iter, chunkSize=1000):
    """
        Take in an iterator, and yield slices of up to chunkSize.
    """
    chunkBuffer = []
    for item in iter:
        chunkBuffer.append(item)
        if len(chunkBuffer) == chunkSize:
            yield chunkBuffer
            chunkBuffer = []
    if len(chunkBuffer) > 0:
        yield chunkBuffer

def clearFalsy(lst):
    return [
        x
        for x
        in lst
        if x
    ]

def clearNone(lst):
    return [
        x
        for x
        in lst
        if (x is not None)
    ]

def explode(lists):
    return list(itertools.chain(*lists))

def listify(item):
    if isinstance(item, list):
        return item
    elif item:
        return [item]
    else:
        return []

def mergeDicts(source, sink):
    if not source:
        source = {}
    if not sink:
        sink = {}

    result = {}
    allKeys = set(source.keys()) | set(sink.keys())
    for key in allKeys:
        if (key in source)\
                and (key in sink)\
                and isinstance(source[key], dict)\
                and isinstance(sink[key], dict):
            result[key] = mergeDicts(source[key], sink[key])
        elif (key in source):
            result[key] = source[key]
        else:
            result[key] = sink[key]
    return result

def naturalSorted(items, key=lambda x: x):

    def atoi(text):
        return int(text) if text.isdigit() else text

    def naturalKeys(value, first=True):
        if first:
            value = key(value)

        if value is None:
            return "~~~~~~~~~~~~~~~~~~~~~"
        elif isinstance(value, str):
            keys = [atoi(c) for c in re.split(r'(\d+)', value)]
            return keys
        elif isinstance(value, list) or isinstance(value, tuple):
            return [naturalKeys(x, False) for x in value]
        else:
            return value

    return sorted(items, key=naturalKeys)

def paginateIterator(iter, total=None, perPage=10):
    if total is None:
        total = len(iter)
    totalPages = int(ceil(total / float(perPage)))
    for (i, chunk) in enumerate(chunk(iter, perPage)):
        yield {
            'total': total,
            'page': i+1,
            'perPage': perPage,
            'pages': totalPages,
            'results': chunk,
        }

def paginateIteratorPage(iter, total=None, perPage=10, page=None):
    if page is None:
        page = 1
    chunk = {
        'total': 0,
        'page': 0,
        'perPage': 0,
        'pages': 0,
        'results': 0
    }

    pager = paginateIterator(iter, total, perPage)
    for chunk in pager:
        if chunk['page'] == page:
            return chunk

    return chunk # gross...

def poll(f, timeout=None, timing=1):
    start = time.time()
    while True:
        result = f()
        if result:
            return result
        time.sleep(timing)
        elapsed = time.time()
        if timeout and (elapsed > timeout):
            raise Timeout("Timeout")

def rowDictify(rows):
    header = None
    for row in rows:
        if header is None:
            header = row
        else:
            yield dict(zip(header, row))

def safe(obj, *keys):
    current = obj
    for key in keys:
        if current is not None:
            try:
                current = current[key]
            except (KeyError, IndexError, TypeError) as err:
                if isinstance(key, str):
                    current = getattr(current, key, None)
                else:
                    current = None
    return current

def safeMax(current, new):
    if current is None:
        return new
    elif new > current:
        return new
    else:
        return current

def safeMaxIter(lst):
    fil = clearNone(lst)
    if fil:
        return max(fil)

def safeMin(current, new):
    if current is None:
        return new
    elif new > current:
        return current
    else:
        return new

def safeMinIter(lst):
    fil = clearNone(lst)
    if fil:
        return min(fil)

class DeepDict(object):

    def __init__(self):
        self.dict = {}

    def get(self, key):
        return self.dict.get(key)

    def items(self):
        return self.dict.items()

    def keys(self):
        return self.dict.keys()

    def put(self, value, *keys):
        current = self.dict
        for key in keys[:-1]:
            if isinstance(current, dict):
                current = current.setdefault(key, {})
            else:
                raise KeyError("Can't reach inside %s" % current)
        current[keys[-1]] = value

    def reach(self, *keys):
        current = self.dict
        for key in keys:
            if isinstance(current, dict):
                current = current.get(key)
            else:
                return None
        return current

    def values(self):
        return self.dict.values()

    def __delitem__(self, key):
        self.dict.__delitem__(key)

    def __iter__(self):
        return self.dict.__iter__()

    def __len__(self):
        return self.dict.__len__()

    def __getitem__(self, key):
        return self.dict.__getitem__(key)

    def __repr__(self):
        return self.dict.__repr__()

    def __setitem__(self, key, value):
        self.dict.__setitem__(key, value)

    def __str__(self):
        return self.dict.__str__()

class Incrementer(object):

    def __init__(self, initial=0):
        self.value = initial

    def get(self):
        output = self.value
        self.value += 1
        return output

class Timeout(Exception):
    pass
