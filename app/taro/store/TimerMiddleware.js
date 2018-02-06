import { APP_START } from 'taro/actions/AppLifecycle'
import { TICK_EVENT, tickEvent } from 'taro/reducers/TimeReducer'
import * as scheduleutil from 'taro/util/scheduleutil'

const startTimer = (store) => {
  const tick = () => {
    store.dispatch(tickEvent(new Date()))
  }
  new scheduleutil.Ticker(1000, tick)
}

const timerMiddleware = (store) => {
  return (next) => (action) => {
    const result = next(action)
    if (action.type === APP_START) {
      startTimer(store)
    }
    return result
  }
}

export default timerMiddleware
