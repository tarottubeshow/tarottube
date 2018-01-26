import {
  Permissions,
  Notifications,
} from 'expo'

import TRACKER from 'taro/tracking'

import * as NagManager from 'taro/controllers/NagManager'
import NOTIFICATIONS_API from 'taro/api/NotificationsApi'

async function maybeRequest() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const hasSeenRecently = await NagManager.hasSeenRecently(
      NagManager.ASKED_FOR_NOTIFICATIONS,
      NagManager.ASKED_FOR_NOTIFICATIONS_CUTOFF,
    )
    if(hasSeenRecently) {
      return
    }

    await NagManager.setSeen(NagManager.ASKED_FOR_NOTIFICATIONS)

    await TRACKER.track("Asked for notifications permission")
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if(status == 'granted') {
      await TRACKER.track("Notifications permission granted")
    } else {
      await TRACKER.track("Notifications permission declined")
    }
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return
  }

  let token = await Notifications.getExpoPushTokenAsync()
  const response = await NOTIFICATIONS_API.subscribe.exec({
    token: token,
  })
}

export {
  maybeRequest,
}
