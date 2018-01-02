import {
  fetchApi,
} from 'taro/api/Api'
import {
  isApiActionStart,
  DISPOSITION_ERROR,
  DISPOSITION_OK,
} from 'taro/actions/ApiActions'
import {
  errorAsPromiseState,
  valueAsPromiseState,
} from 'taro/util/promiseutil'

function handleApiRequest(action, store) {
  if(isApiActionStart(action)) {
    invokeApiAction(action, store)
  }
}

async function invokeApiAction(action, store) {
  const payload = action.__API__
  const promise = fetchApi(payload.request)
  let response
  try {
    response = await promise
  }
  catch (e) {
    const errorAction = {
      ...action,
      type: `${ payload.type }:ERROR`,
      __API__: {
        ...payload,
        disposition: DISPOSITION_ERROR,
        state: errorAsPromiseState(e),
      },
      __PARENT__: action,
    }
    return store.dispatch(errorAction)
  }

  const okAction = {
    ...action,
    type: `${ payload.type }:OK`,
    __API__: {
      ...payload,
      disposition: DISPOSITION_OK,
      state: valueAsPromiseState(response),
    },
    __PARENT__: action,
  }
  return store.dispatch(okAction)
}

const apiMiddleware = (store) => (next) => {
  return (action) => {
    const result = next(action)
    if(action.__API__ != null) {
      handleApiRequest(action, store)
    }
    return result
  }
}

export default apiMiddleware
