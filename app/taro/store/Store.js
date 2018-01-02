import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'

function buildStore(reducers, middlewares) {
  const reducer = combineReducers(reducers)
  return createStore(
    reducer,
    applyMiddleware(...middlewares),
  )
}

export {
  buildStore,
}
