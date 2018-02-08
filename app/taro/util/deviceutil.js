import { Platform } from 'react-native'

function ifAndroid(val) {
  if(isAndroid()) {
    return val
  }
}

function ifIos(val) {
  if(isIos()) {
    return val
  }
}

function isAndroid() {
  return Platform.OS == 'android'
}

function isIos() {
  return Platform.OS == 'ios'
}

export {
  ifAndroid,
  ifIos,
  isAndroid,
  isIos,
}
