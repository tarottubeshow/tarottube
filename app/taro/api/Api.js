import { serialize } from 'taro/util/urlutil'
import { makeApiAction } from 'taro/actions/ApiActions'
import { getConfig, wrapClass } from 'taro/util/metautil'

// error

class ApiError extends Error {
  constructor({ reason, error, ...detail }) {
    super(`API ERROR: ${ reason }`)
    this.reason = reason
    this.error = error
    this.detail = detail
  }
}

// request builders

function apiUrl(path, params = {}) {
  return `${ getConfig().URL.API }/api/2/${ path }.json?${ serialize(params) }`
}

async function readJsonResponse(response) {
  if (response.ok) {
    let data
    try {
      // we assume it's json, call it an error if it's not
      data = await response.json()
    }
    catch (e) {
      throw new ApiError({
        reason: 'JSON-READ-FAILED',
        error: e,
      })
    }

    return data
  }
  let text
  try {
    text = await response.text()
  }
  catch (e) {
    throw new ApiError({
      reason: 'ERROR-READ-FAILED',
      error: e,
    })
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  }
  catch (e) {
    parsed = null
  }

  throw new ApiError({
    reason: `HTTP-STATUS:${ response.status }`,
    status: response.status,
    text,
    data: parsed,
  })
}

async function handleResponse(request, rawResponse) {
  let response = await readJsonResponse(rawResponse)
  if(request.map != null) {
    response = request.map(response)
  }
  if(request.cls != null) {
    if(request.parseToRefs) {
      response = request.cls.parseToRefs(request.cls, response)
    } else {
      response = wrapClass(response, request.cls)
    }

  }
  return response
}

function commonRequestParams(options) {
  return {
    cls: options.cls,
    map: options.map,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    force: options.force,
  }
}

const get = ({ path, data = {}, ...options }) => ({
  ...commonRequestParams(options),
  url: apiUrl(path, data),
  method: 'GET',
})

const post = ({ path, data = {}, ...options }) => ({
  ...commonRequestParams(options),
  url: apiUrl(path),
  method: 'POST',
  body: JSON.stringify(data),
})

// processing

async function fetchApi(request) {
  let rawResponse
  try {
    rawResponse = await fetch(request.url, request)
  }
  catch (e) {
    throw new ApiError({
      reason: 'HTTP-REQUEST-FAILED',
      error: e,
    })
  }

  const response = await handleResponse(
    request,
    rawResponse,
  )
  return response
}

// action wrappers

function makeApi(parentKey, key, requestMaker) {
  const actionType = `__API__:${ parentKey }.${ key }`
  return {
    actionType: actionType,
    action: (params) => makeApiAction({
      requestMaker: requestMaker,
      type: actionType,
      ...params,
    }),
  }
}

function makeApiWrapper(parentKey, apis) {
  const apiWrapper = {}
  for(const [key, requestMaker] of Object.entries(apis)) {
    apiWrapper[key] = makeApi(parentKey, key, requestMaker)
  }
  return apiWrapper
}

export {
  get,
  post,
  fetchApi,
  makeApiWrapper,
}
