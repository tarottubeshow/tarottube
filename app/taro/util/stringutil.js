import { isString } from 'lodash/lang'

export function forceString(obj) {
  if (isString(obj)) {
    return obj
  }
  return JSON.stringify(obj)
}
