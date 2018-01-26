const GOT_FIREBASE_VALUE = 'taro.FirebaseActions.GOT_FIREBASE_VALUE'
const OBSERVE_FIREBASE_VALUE = 'taro.FirebaseActions.OBSERVE_FIREBASE_VALUE'
const UNOBSERVE_FIREBASE_VALUE = 'taro.FirebaseActions.UNOBSERVE_FIREBASE_VALUE'

const gotFirebaseValue = (key, value) => ({
  type: GOT_FIREBASE_VALUE,
  key: key,
  value: value,
})

const observeFirebaseValue = (watchSpec) => ({
  type: OBSERVE_FIREBASE_VALUE,
  watchSpec: watchSpec,
})

const unobserveFirebaseValue = (watchSpec) => ({
  type: UNOBSERVE_FIREBASE_VALUE,
  watchSpec: watchSpec,
})

export {
  GOT_FIREBASE_VALUE,
  gotFirebaseValue,

  OBSERVE_FIREBASE_VALUE,
  observeFirebaseValue,

  UNOBSERVE_FIREBASE_VALUE,
  unobserveFirebaseValue,
}
