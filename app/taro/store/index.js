import apiMiddleware from './ApiMiddleware'
import deviceMiddleware from './DeviceMiddleware'
import firebaseMiddleware from './FirebaseMiddleware'
import modelRegistryMiddleware from './ModelRegistryMiddleware'
import loggingMiddleware from './LoggingMiddleware'
import pollManagerMiddleware from './PollManagerMiddleware'
import routerMiddleware from './RouterMiddleware'
import timerMiddleware from './TimerMiddleware'

const middlewares = [
  loggingMiddleware,
  apiMiddleware,
  deviceMiddleware,
  firebaseMiddleware,
  modelRegistryMiddleware,
  pollManagerMiddleware,
  routerMiddleware,
  timerMiddleware,
]

export default middlewares
