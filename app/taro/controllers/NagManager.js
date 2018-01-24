import { AsyncStorage } from 'react-native'

const SEEN_INTRO_VIDEO = 'seenIntroVideo:1'

function makeKey(key) {
  return `@Nag:${ key }`
}

async function hasSeen(key) {
  return await AsyncStorage.getItem(makeKey(key))
}

async function setSeen(key) {
  await AsyncStorage.setItem(makeKey(key), "true")
}

export {
  hasSeen,
  setSeen,
  SEEN_INTRO_VIDEO,
}
