import {
  isApiAction,
  getApiState,
} from 'taro/actions/ApiActions'

export function makeApiActionReducer(api, key) {
  const reducer = (state = {}, action = {}) => {
    return reduceApiAction(action, api, state, key)
  }
  return reducer
}

export function reduceApiAction(action, api, state, key) {
  if(isApiAction(action, api)) {
    return {
      ...state,
      [key]: getApiState(action),
    }
  } else {
    return state
  }
}
