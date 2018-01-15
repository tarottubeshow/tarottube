// TODO: this whole thing probably needs to be more sophisticated

import * as firebase from 'firebase'

import { APP_START } from 'taro/actions/AppLifecycle'
import { gotFirebaseValue } from 'taro/actions/FirebaseActions'
import { wrapClass } from 'taro/util/metautil'
import Timeslot from 'taro/models/Timeslot'

const STANDARD_WATCH_SPECS = [
  {
    firebaseKey: 'timeslots',
    cls: Timeslot,
    keyed: true,
  },
]

const observe = (store, watchSpec) => {
  const firebaseKey = watchSpec.firebaseKey
  const ref = firebase.database().ref(firebaseKey)
  ref.on('value', (entry) => {
    var firebaseValue = entry.val()

    if(watchSpec.keyed) {
      const wrappedValue = {}
      for(const modelKey in firebaseValue) {
        const modelValue = firebaseValue[modelKey]
        wrappedValue[modelKey] = wrapClass(modelValue, watchSpec.cls, true)
      }
      firebaseValue = wrappedValue
    } else {
      firebaseValue = wrapClass(firebaseValue, watchSpec.cls, true)
    }

    store.dispatch(gotFirebaseValue(firebaseKey, firebaseValue))
  })
}

const startStandardObservers = (store) => {
  for(const watchSpec of STANDARD_WATCH_SPECS) {
    observe(store, watchSpec)
  }
}

const firebaseMiddleware = (store) => {
  firebase.initializeApp(global.CONFIG.FIREBASE)
  return (next) => (action) => {
    const result = next(action)
    if (action.type === APP_START) {
      startStandardObservers(store)
    }
    return result
  }
}

export default firebaseMiddleware
