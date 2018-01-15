import { APP_START } from 'taro/actions/AppLifecycle'
import { TICK_EVENT, tickEvent } from 'taro/reducers/TimeReducer'

const startTimer = (store) => {
  const updateTime = () => {
    store.dispatch(tickEvent(new Date()))
  }
  global.setInterval(updateTime, 1000)
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
