import { GOT_FIREBASE_VALUE } from 'taro/actions/FirebaseActions'

import { reach } from 'taro/util/metautil'
import * as FirebaseMiddleware from 'taro/store/FirebaseMiddleware'

// Reducers

function firebaseReducer(state = {}, action = {}) {
  switch (action.type) {
    case GOT_FIREBASE_VALUE: {
      return {
        ...state,
        [action.key]: action.value,
      }
    }
    default:
      return state
  }
}

// Selectors

const getTimeslots = (state) => {
  return state.Firebase[FirebaseMiddleware.TIMESLOTS_KEY]
}

const getPlaylist = (state, timeslot, type, quality) => {
  const stream_key = timeslot.stream_key
  const playlistKey = `${ stream_key }:${ type }:${ quality }`
  return reach(
    state, [
      'Firebase',
      FirebaseMiddleware.PLAYLISTS_KEY,
      playlistKey,
    ]
  )
}

export default firebaseReducer
export {
  getPlaylist,
  getTimeslots,
}
