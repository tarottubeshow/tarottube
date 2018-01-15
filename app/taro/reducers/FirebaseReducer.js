import { GOT_FIREBASE_VALUE } from 'taro/actions/FirebaseActions'

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

export default firebaseReducer
