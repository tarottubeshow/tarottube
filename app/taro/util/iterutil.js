import { idFunc } from 'taro/util/funcutil'

export function first(arr) {
  if(arr.length > 0) {
    return arr[0]
  }
}

export function forceArray(obj) {
  if(obj == null) {
    return []
  } else if(Array.isArray(obj)) {
    return obj
  } else {
    return [obj]
  }
}

export function last(arr) {
  if(arr.length > 0) {
    return arr[arr.length - 1]
  }
}

export function sorted({
  list,
  key,
  reverse=false,
}) {
  const clone = [...list]
  if(key == null) {
    clone.sort()
  } else {
    clone.sort((a, b) => _sortedCompare(key(a), key(b)))
  }
  if(reverse) {
    clone.reverse()
  }
  return clone
}

function _sortedCompare(a, b) {
  if(a < b) {
    return -1
  } else if(a > b) {
    return 1
  } else {
    return 0
  }
}

export function uniquify(lst, key=null) {
  if(key == null) {
    key = idFunc
  }

  const seen = {}
  const items = []
  for(const item of lst) {
    const itemKey = key(item)
    if(seen[itemKey] == null) {
      items.push(item)
      seen[itemKey] = true
    }
  }

  return items
}

const UNIQUE_ID_CONTAINER = {
  value: 1293871,
}

export function uniqueId(prefix) {
  UNIQUE_ID_CONTAINER.value += 1
  return `${ prefix }__${ UNIQUE_ID_CONTAINER.value }`
}
