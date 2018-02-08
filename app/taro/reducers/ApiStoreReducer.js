import * as ApiActions from 'taro/actions/ApiActions'
import { reach } from 'taro/util/metautil'

// Reducers

function apiStoreReducer(state = {}, action = {}) {
  if(
    ApiActions.hasApiRequest(action)
    && (action.__API_STORE_KEY__ != null)
  ) {
    return {
      ...state,
      [action.__API_STORE_KEY__]: ApiActions.getApiState(action),
    }
  } else {
    return state
  }
}

export default apiStoreReducer
