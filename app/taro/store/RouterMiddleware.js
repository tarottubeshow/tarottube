// TODO: android nav events?

import { APP_START } from 'taro/actions/AppLifecycle'
import { REQUEST_ROUTE_CHANGE, routeChanged } from 'taro/actions/RouterActions'

function _handleLocationChange(route, dispatch) {
  dispatch(routeChanged(route))
}

// middlewares

const routerMiddleware = (store) => (next) => {
  return (action) => {
    const result = next(action)
    if (action.type === APP_START) {
      _handleLocationChange({context: 'home'}, store.dispatch)
    }
    if (action.type === REQUEST_ROUTE_CHANGE) {
      _handleLocationChange(action.route, store.dispatch)
    }
    return result
  }
}

export default routerMiddleware
