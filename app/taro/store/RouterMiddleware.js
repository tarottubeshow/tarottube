import * as AppLifecycle from 'taro/actions/AppLifecycle'
import * as RouterActions from 'taro/actions/RouterActions'
import * as NagManager from 'taro/controllers/NagManager'

async function _start(store) {
  const seenIntroVideo = await NagManager.hasSeen(NagManager.SEEN_INTRO_VIDEO)

  let route
  if(seenIntroVideo) {
    route = {context: 'home'}
  } else {
    route = {context: 'intro'}
  }

  _handleLocationChange(route, store.dispatch)
}

function _handleLocationChange(route, dispatch) {
  dispatch(RouterActions.routeChanged(route))
}

// middlewares

const routerMiddleware = (store) => (next) => {
  return (action) => {
    const result = next(action)
    if (action.type === AppLifecycle.APP_START) {
      _start(store)
    }
    if (action.type === RouterActions.REQUEST_ROUTE_CHANGE) {
      _handleLocationChange(action.route, store.dispatch)
    }
    return result
  }
}

export default routerMiddleware
