import {
  getApiState,
  hasApiRequest,
} from 'taro/actions/ApiActions'
import { combineReducersFuncs } from 'taro/util/funcutil'
import { reach } from 'taro/util/metautil'
import { coalesce, isObject } from 'taro/util/typeutil'
import { isFulfilled, valueAsPromiseState } from 'taro/util/promiseutil'
import { forceArray } from 'taro/util/iterutil'

// Registry helpers

function _extractEntries(state, request, promise) {
  if(isFulfilled(promise)) {
    return _extractEntriesFromFulfilledPromise(
      state,
      request,
      promise,
    )
  } else {
    return _extractEntriesFromUnfulfilledPromise(
      state,
      request,
      promise,
    )
  }
}

function _extractEntriesFromFulfilledPromise(state, request, promise) {
  const refs = forceArray(promise.value)
  const entries = {}
  for(const ref of refs) {
    const key = _generateRegistryKey(ref.constructor, ref.getId())
    const existing = reach(state, [key, 'promise', 'value'])

    let value
    if(existing != null) {
      value = existing._merge(request, ref)
    } else {
      value = ref
    }

    entries[key] = {
      promise: valueAsPromiseState(value),
      enhancements: {},
    }
  }
  return entries
}

function _extractEntriesFromUnfulfilledPromise(state, request, promise) {
  const key = _generateRegistryKey(request.cls, request.id)
  const existing = state[key]

  if(
    (existing == null)
    ||
    (
      (!request.cache)
      &&
      (request.enhance == null)
    )
  ) {
    return {
      [key]: {
        promise: promise,
        enhancements: {}
      }
    }
  }

  if(request.enhance != null) {
    return {
      [key]: {
        promise: existing.promise,
        enhancements: {
          ...existing.enhancements,
          [request.enhance]: promise,
        }
      }
    }
  }

  return {}
}

function _generateRegistryKey(cls, id) {
  return `${ cls.key }:${ id }`
}

const putToState = (state, request, promise) => {
  const entriesToPut = _extractEntries(state, request, promise)
  return {
    ...state,
    ...entriesToPut,
  }
}

const DEFAULT_STATE = {}

// Reducers

const updateRegistryReducer = (
  state = DEFAULT_STATE,
  action = {},
) => {
  const registryRequest = action.__MODEL_REGISTRY__
  if(
    (registryRequest != null)
    &&
    (hasApiRequest(action))
  ) {
    return putToState(
      state,
      registryRequest,
      getApiState(action),
    )
  }
  return state
}

const registryReducer = combineReducersFuncs(
  DEFAULT_STATE,
  updateRegistryReducer,
)

const _forceTargetToParams = (target) => {
  if(isObject(target)) {
    return target
  } else {
    return { id: target }
  }
}

// Selectors

const getModelEntryByRawId = (state, cls, id) => {
  const key = _generateRegistryKey(cls, id)
  return reach(state, ['ModelRegistry', key])
}

const getModelEntry = (state, cls, target) => {
  target = _forceTargetToParams(target)
  const id = cls.extractId(target)
  return getModelEntryByRawId(state, cls, id)
}

const getEnhancementPromise = (state, cls, target, enhanceKey) => {
  return reach(
    getModelEntry(state, cls, target),
    ['enhancements', enhanceKey],
  )
}

const getModel = (state, cls, target) => {
  return reach(
    getModelEntry(state, cls, target),
    ['promise', 'value'],
  )
}

const getModelPromise = (state, cls, target) => {
  return reach(
    getModelEntry(state, cls, target),
    ['promise'],
  )
}

const getRelatedModel = (state, cls, target, relationship) => {
  const model = getModel(state, cls, target)
  if(model != null) {
    const relationshipCls = cls.relationships[relationship].cls
    return getModel(state, relationshipCls, model[relationship])
  }
}

const getRelatedModels = (state, cls, target, relationship) => {
  const model = getModel(state, cls, target)
  if(model != null) {
    const relationshipCls = cls.relationships[relationship].cls
    return model[relationship].map(
      (item) => (
        getModel(state, relationshipCls, item)
      )
    )
  }
}

export default registryReducer
export {
  getEnhancementPromise,
  getModel,
  getModelPromise,
  getModelEntry,
  getModelEntryByRawId,
  getRelatedModel,
  getRelatedModels,
  _forceTargetToParams,
}
