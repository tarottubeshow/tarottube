// TODO: this whole thing probably needs to be more sophisticated

import * as firebase from 'firebase'

import * as AppLifecycle from 'taro/actions/AppLifecycle'
import * as FirebaseActions from 'taro/actions/FirebaseActions'
import { wrapClass } from 'taro/util/metautil'
import Timeslot from 'taro/models/Timeslot'
import TimeslotPlaylist from 'taro/models/TimeslotPlaylist'

const TIMESLOTS_KEY = 'STANDARD_WATCH_SPECS.TIMESLOTS_KEY'
const PLAYLISTS_KEY = 'STANDARD_WATCH_SPECS.PLAYLISTS_KEY'

const STANDARD_WATCH_SPECS = [
  {
    firebaseKey: 'timeslots',
    cls: Timeslot,
    keyed: true,
    refKey: TIMESLOTS_KEY,
  },
  {
    firebaseKey: 'playlists',
    cls: TimeslotPlaylist,
    keyed: true,
    refKey: PLAYLISTS_KEY,
  },
]

class FirebaseRefManager {

  constructor(store) {
    this.store = store
    this.refs = {}
  }

  refreshAllRefs = () => {
    for(const refKey in this.refs) {
      this.unsubscribe(refKey)
      this.subscribe(refKey)
    }
  }

  observe = (watchSpec) => {
    const {
      refKey,
      firebaseKey,
    } = watchSpec
    const shardKey = global.CONFIG.FIREBASE.shard
    const ref = firebase.database().ref(`${ shardKey }/${ firebaseKey }`)
    this.refs[refKey] = {
      ref: ref,
      watchSpec: watchSpec,
    }
    this.subscribe(refKey)
  }

  onValueReceived = (entry, watchSpec) => {
    const {
      keyed,
      cls,
      refKey,
    } = watchSpec

    const value = this._wrap(
      entry.val(),
      watchSpec,
    )
    const action = FirebaseActions.gotFirebaseValue(
      refKey,
      value,
    )
    this.store.dispatch(action)
  }

  subscribe = (refKey) => {
    const {
      ref,
      watchSpec,
    } = this.refs[refKey]
    ref.on('value', (entry) => this.onValueReceived(entry, watchSpec))
  }

  unobserve = (watchSpec) => {
    this.unsubscribe(watchSpec.refKey)
    delete this.refs[watchSpec.refKey]
  }

  unsubscribe = (refKey) => {
    const {
      ref,
    } = this.refs[refKey]
    ref.off()
  }

  _wrap = (rawValue, watchSpec) => {
    const {
      keyed,
      cls,
      map,
    } = watchSpec

    if(map != null) {
      rawValue = map(rawValue)
    }

    if(keyed && (cls != null)) {
      const wrappedValue = {}
      for(const modelKey in rawValue) {
        const modelValue = rawValue[modelKey]
        wrappedValue[modelKey] = wrapClass(modelValue, cls, true)
      }
      return wrappedValue
    } else if(cls != null) {
      return wrapClass(rawValue, cls, true)
    } else {
      return rawValue
    }
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
    } else if (action.type === AppLifecycle.APP_RESUME) {
      MANAGER.refreshAllRefs()
    } else if (action.type === FirebaseActions.OBSERVE_FIREBASE_VALUE) {
      MANAGER.observe(action.watchSpec)
    } else if (action.type === FirebaseActions.UNOBSERVE_FIREBASE_VALUE) {
      MANAGER.unobserve(action.watchSpec)
    }
    return result
  }
}

export default firebaseMiddleware
export {
  TIMESLOTS_KEY,
  PLAYLISTS_KEY,
}
