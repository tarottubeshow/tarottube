const GOT_FIREBASE_VALUE = 'taro.FirebaseActions.GOT_FIREBASE_VALUE'

const gotFirebaseValue = (key, value) => ({
  type: GOT_FIREBASE_VALUE,
  key: key,
  value: value,
})

export {
  GOT_FIREBASE_VALUE,
  gotFirebaseValue,
}
