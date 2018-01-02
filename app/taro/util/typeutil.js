export function boolToString(val) {
  if(val) {
    return 'yes'
  } else {
    return 'no'
  }
}

export function coalesce(...values) {
  for(const value of values) {
    if(value != null) {
      return value
    }
  }
}

export function isBool(val) {
   return val === false || val === true;
}

export function isNumber(val) {
  return typeof val === 'number'
}

export function isString(val) {
  return (
    (typeof val === 'string')
    ||
    (val instanceof String)
  )
}

export function isPrimitive(val) {
  return (
    isNumber(val)
    ||
    isBool(val)
    ||
    isString(val)
  )
}

export function isObject(val) {
  return (
    (val != null)
    &&
    (typeof val === 'object')
  )
}

export function toBool(bool) {
  if(bool) {
    return true
  } else {
    return false
  }
}

export function toString(value) {
  return `${ value }`
}
