import { isString } from 'lodash/lang'

export function forceString(obj) {
  if (isString(obj)) {
    return obj
  }
  return JSON.stringify(obj)
}

export function zfill(number, width) {
  var pad = new Array(1 + width).join('0');
  return (pad + number).slice(-pad.length);
}
