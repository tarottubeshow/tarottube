import {
  isApiActionOk,
  isApiActionError,
} from 'taro/actions/ApiActions'
import {
  POLL_START,
  POLL_END,
} from 'taro/actions/PollActions'
import {
  getConfig,
} from 'taro/util/metautil'

function getPollEntry(registry, key) {
  return registry[key]
}

function getPollRequest(registry, key) {
  return registry[key].request
}

function schedulePolling(registry, key, dispatch) {
  const pollRequest = getPollRequest(registry, key)

  const timeoutId = global.setTimeout(
    (() => runPolling(registry, key, dispatch)),
    getConfig()['POLL_DELAY'],
  )
  registry[pollRequest.key].timeoutId = timeoutId
}

function runPolling(registry, key, dispatch) {
  const pollEntry = getPollEntry(registry, key)
  if(pollEntry.active) {
    const pollRequest = pollEntry.request
    dispatch({
      ...pollRequest.action,
      __POLL__: pollRequest,
    })
  }
}

function startPolling(registry, action, dispatch) {
  const pollRequest = action.__POLL__

  registry[pollRequest.key] = {
    active: true,
    request: pollRequest,
  }

  schedulePolling(registry, pollRequest.key, dispatch)
}

function endPolling(registry, action) {
  const pollRequest = action.__POLL__
  registry[pollRequest.key].active = false
  global.clearTimeout(registry[pollRequest.key].timeoutId)
}

const pollManagerMiddleware = (store) => (next) => {
  const registry = {}
  return (action) => {
    const result = next(action)

    if(action.__POLL__ != null) {
      const dispatch = (nextAction) => {
        store.dispatch({
          ...nextAction,
          __PARENT__: action,
        })
      }

      if(action.type === POLL_START) {
        startPolling(registry, action, dispatch)
      } else if (action.type === POLL_END) {
        endPolling(registry, action)
      } else if(isApiActionOk(action) || isApiActionError(action)) {
        schedulePolling(
          registry,
          action.__POLL__.key,
          dispatch,
        )
      }
    }

    return result
  }
}

export default pollManagerMiddleware
