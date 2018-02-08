import * as AppLifecycle from 'taro/actions/AppLifecycle'
import * as RouterActions from 'taro/actions/RouterActions'
import * as NagManager from 'taro/controllers/NagManager'

async function _start(history, store) {
  const seenIntroVideo = await NagManager.hasSeen(NagManager.SEEN_INTRO_VIDEO)

  let route
  if(seenIntroVideo) {
    route = {context: 'home'}
  } else {
    route = {context: 'intro'}
  }

  _handleLocationChange(history, route, store)
}

function _handleLocationChange(history, route, store) {
  history.push(route)
  store.dispatch(RouterActions.routeChanged(route))
}

// middlewares

const routerMiddleware = (store) => (next) => {
  const history = []
  return (action) => {
    const result = next(action)
    if (action.type === AppLifecycle.APP_START) {
      _start(history, store)
    } else if (action.type === RouterActions.REQUEST_ROUTE_CHANGE) {
      const route = action.route
      _handleLocationChange(
        history,
        route,
        store,
      )
    }  else if (action.type === RouterActions.REQUEST_BACK) {
      const current = history.pop()
      const back = history.pop() || {context: 'home'}
      _handleLocationChange(
        history,
        back,
        store,
      )
    }
    return result
  }
}

export default routerMiddleware
