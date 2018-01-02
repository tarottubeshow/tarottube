import { reach } from 'taro/util/metautil'
import { UNSETTLED_PROMISE_STATE } from 'taro/util/promiseutil'

const DISPOSITION_START = 'start'
const DISPOSITION_OK = 'ok'
const DISPOSITION_ERROR = 'error'

function makeApiAction({
  requestMaker,
  type,
  ...params,
}) {
  const request = requestMaker(params)
  request.parseToRefs = params._parseToRefs
  return {
    __API__: {
      type: type,
      disposition: DISPOSITION_START,
      request: request,
      state: UNSETTLED_PROMISE_STATE,
    },
    type: type,
    ...params,
  }
}

function getApiState(action) {
  return action.__API__.state
}

function isApiAction(action, api) {
  const apiType = reach(action, ['__API__', 'type'])
  return (apiType === api.actionType)
}

function isApiActionError(action) {
  return reach(action, ['__API__', 'disposition']) === DISPOSITION_ERROR
}

function isApiActionOk(action) {
  return reach(action, ['__API__', 'disposition']) === DISPOSITION_OK
}

function isApiActionStart(action) {
  return reach(action, ['__API__', 'disposition']) === DISPOSITION_START
}

function hasApiRequest(action) {
  return (action.__API__ != null)
}

export {
  makeApiAction,

  getApiState,
  hasApiRequest,

  isApiAction,
  isApiActionError,
  isApiActionOk,
  isApiActionStart,

  DISPOSITION_START,
  DISPOSITION_OK,
  DISPOSITION_ERROR,
}
