import { createLogger as createReduxLogger } from 'redux-logger'

import apiMiddleware from './ApiMiddleware'
import deviceMiddleware from './DeviceMiddleware'
import firebaseMiddleware from './FirebaseMiddleware'
import modelRegistryMiddleware from './ModelRegistryMiddleware'
import pollManagerMiddleware from './PollManagerMiddleware'
import routerMiddleware from './RouterMiddleware'
import timerMiddleware from './TimerMiddleware'

import { TICK_EVENT } from 'taro/reducers/TimeReducer'

const loggerMiddleware = createReduxLogger({
  predicate: (getState, action) => {
    if(action.type == TICK_EVENT) {
      return false
    }
    return true
  }
})

const middlewares = [
  loggerMiddleware,
  apiMiddleware,
  deviceMiddleware,
  firebaseMiddleware,
  modelRegistryMiddleware,
  pollManagerMiddleware,
  routerMiddleware,
  timerMiddleware,
]

export default middlewares
