import { createLogger as createReduxLogger } from 'redux-logger'

import apiMiddleware from './ApiMiddleware'
import modelRegistryMiddleware from './ModelRegistryMiddleware'
import pollManagerMiddleware from './PollManagerMiddleware'

const middlewares = [
  apiMiddleware,
  modelRegistryMiddleware,
  pollManagerMiddleware,
  createReduxLogger(),
]

export default middlewares
