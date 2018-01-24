// TODO: this whole thing probably needs to be more sophisticated

import * as firebase from 'firebase'

import * as AppLifecycle from 'taro/actions/AppLifecycle'
import { gotFirebaseValue } from 'taro/actions/FirebaseActions'
import { wrapClass } from 'taro/util/metautil'
import Timeslot from 'taro/models/Timeslot'
import TimeslotPlaylist from 'taro/models/TimeslotPlaylist'

const STANDARD_WATCH_SPECS = [
  {
    firebaseKey: 'timeslots',
    cls: Timeslot,
    keyed: true,
  },
  {
    firebaseKey: 'playlists',
    cls: TimeslotPlaylist,
    keyed: true,
  },
]

class FirebaseRefManager {

  constructor(store) {
    this.store = store
    this.refs = {}
  }

  refreshAllRefs = () => {
    for(const key in this.refs) {
      this.unsubscribe(key)
      this.subscribe(key)
    }
  }

  observe = (watchSpec) => {
    const shardKey = global.CONFIG.FIREBASE.shard
    const firebaseKey = watchSpec.firebaseKey
    const ref = firebase.database().ref(`${ shardKey }/${ firebaseKey }`)
    this.refs[firebaseKey] = {
      firebaseKey: firebaseKey,
      ref: ref,
      watchSpec: watchSpec,
    }
    this.subscribe(firebaseKey)
  }

  subscribe = (firebaseKey) => {
    const {
      ref,
      watchSpec,
    } = this.refs[firebaseKey]
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

      this.store.dispatch(gotFirebaseValue(firebaseKey, firebaseValue))
    })
  }

  unsubscribe = (firebaseKey) => {
    const {
      ref,
    } = this.refs[firebaseKey]
    ref.off()
  }

}

const startStandardObservers = (manager) => {
  for(const watchSpec of STANDARD_WATCH_SPECS) {
    manager.observe(watchSpec)
  }
}

const firebaseMiddleware = (store) => {
  const MANAGER = new FirebaseRefManager(store)
  firebase.initializeApp(global.CONFIG.FIREBASE)
  return (next) => (action) => {
    const result = next(action)
    if (action.type === AppLifecycle.APP_START) {
      startStandardObservers(MANAGER)
    }
    if (action.type === AppLifecycle.APP_RESUME) {
      MANAGER.refreshAllRefs()
    }
    return result
  }
}

export default firebaseMiddleware
