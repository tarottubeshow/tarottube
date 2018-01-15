import { reach } from 'taro/util/metautil'
import { coalesce, toBool } from 'taro/util/typeutil'

export function combinePromiseStates(promises) {
  var anyPending = false
  var values = []
  var reasons = []

  for(const [i, promise] of Object.entries(promises)) {
    if(promise == null || !promise.settled) {
      anyPending = true
    } else if(promise.fulfilled) {
      values.push(promise.value)
    } else if(promise.rejected) {
      reasons.push({
        index: i,
        reason: promise.reason,
      })
    }
  }

  if (reasons.length > 0) {
    return {
      settled: true,
      rejected: true,
      fulfilled: false,
      reason: reasons,
    }
  } else if (anyPending) {
    return {
      settled: false,
      rejected: false,
      fulfilled: false,
    }
  } else {
    return {
      settled: true,
      rejected: false,
      fulfilled: true,
      value: values,
    }
  }
}

export function isFulfilled(promise) {
  return toBool(reach(promise, 'fulfilled'))
}

export function isRejected(promise) {
  return toBool(reach(promise, 'rejected'))
}

export function isSettled(promise) {
  return toBool(reach(promise, 'settled'))
}

export function isSettling(promise) {
  return !coalesce(reach(promise, 'settled'), true)
}

export function errorAsPromiseState(reason) {
  return {
    settled: true,
    rejected: true,
    fulfilled: false,
    reason: reason,
  }
}

export function hasValueAsPromiseState(value) {
  const isReady = (value != null)
  return {
    settled: isReady,
    rejected: false,
    fulfilled: isReady,
    value: isReady,
  }
}

export function readyBoolAsPromiseState(isReady) {
  return {
    settled: isReady,
    rejected: false,
    fulfilled: isReady,
    value: isReady,
  }
}

export function valueAsPromiseState(value) {
  return {
    settled: true,
    rejected: false,
    fulfilled: true,
    value: value,
  }
}

export const NULL_FULFILLED_PROMISE_STATE = valueAsPromiseState(null)

export const UNSETTLED_PROMISE_STATE = {
  settled: false,
  rejected: false,
  fulfilled: false,
}
