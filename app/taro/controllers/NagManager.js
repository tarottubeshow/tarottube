import { AsyncStorage } from 'react-native'

const ASKED_FOR_NOTIFICATIONS = 'askedForNotifications:1'
const SEEN_INTRO_VIDEO = 'seenIntroVideo:2'

const ASKED_FOR_NOTIFICATIONS_CUTOFF = 259200 // 72 hours

function makeKey(key) {
  return `@Nag:${ key }`
}

async function hasSeen(key) {
  const raw = await AsyncStorage.getItem(makeKey(key))
  return (raw != null)
}

async function hasSeenRecently(key, cutoff) {
  const raw = await AsyncStorage.getItem(makeKey(key))
  if(raw == null) {
    return false
  }

  const delta = (new Date()) - (new Date(raw))
  return (delta < cutoff)
}

async function setSeen(key) {
  const now = new Date()
  await AsyncStorage.setItem(makeKey(key), now.toString())
}

export {
  hasSeen,
  hasSeenRecently,
  setSeen,

  ASKED_FOR_NOTIFICATIONS,
  ASKED_FOR_NOTIFICATIONS_CUTOFF,
  SEEN_INTRO_VIDEO,
}
