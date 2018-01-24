import { noargActionCreator } from 'taro/actions/Action'

const APP_START = 'taro.AppLifecycle.APP_START'
const APP_RESUME = 'taro.AppLifecycle.APP_RESUME'

const appStart = noargActionCreator(APP_START)
const appResume = noargActionCreator(APP_RESUME)

export {
  APP_START,
  appStart,

  APP_RESUME,
  appResume,
}
