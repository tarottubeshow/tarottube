import eventBrokerMiddleware from 'taro/store/EventBrokerMiddleware'

import { getSpec } from 'taro/models'
import { getModelEntryByRawId } from 'taro/reducers/ModelRegistryReducer'
import { hasApiRequest } from 'taro/actions/ApiActions'
import { isFulfilled, isSettling } from 'taro/util/promiseutil'

const modelRegistryMiddleware = eventBrokerMiddleware(
  ({
    action,
    dispatch,
    getState,
  }) => {
    if(
      (action.__MODEL_REGISTRY__ != null)
      &&
      (!hasApiRequest(action))
    ){
      const request = action.__MODEL_REGISTRY__

      const existing = getModelEntryByRawId(
        getState(),
        request.cls,
        request.id,
      )

      if(
        request.cache
        &&
        existing != null
        &&
        (
          isFulfilled(existing.promise)
          ||
          isSettling(existing.promise)
        )
      ) {
        return
      }

      const spec = getSpec(request.cls)

      let params
      if(request.enhance == null) {
        params = request.target
      } else {
        const existingModel = existing.promise.value
        if(existingModel == null) {
          console.warn("Trying to enhance a model that does not exist!")
          return
        }
        params = existingModel._makeEnhanceRequest(request)
      }

      const apiAction = _makeApiAction(spec, params, request)
      dispatch({
        ...action,
        ...apiAction,
      })
    }
  }
)

const _makeApiAction = (spec, params, request) => {
  return spec.api.action({
    ...params,
    _parseToRefs: true,
    __MODEL_REGISTRY__: request,
  })
}

export default modelRegistryMiddleware
