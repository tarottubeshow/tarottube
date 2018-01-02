import { ROUTE_CHANGED } from 'taro/actions/RouterActions'

// Reducer
function routerReducer(state = {ready: false}, action = {}) {
  const { type, route } = action

  switch (type) {
    case ROUTE_CHANGED: {
      return {
        ready: true,
        ...route,
      }
    }
    default:
      return state
  }
}

export default routerReducer
