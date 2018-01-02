import { noargActionCreator } from 'taro/actions/Action'

const APP_START = 'taro.AppLifecycle.APP_START'

const appStart = noargActionCreator(APP_START)

export {
  APP_START,
  appStart,
}
