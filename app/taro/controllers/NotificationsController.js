import {
  Permissions,
  Notifications,
} from 'expo'

import TRACKER from 'taro/tracking'

import NOTIFICATIONS_API from 'taro/api/NotificationsApi'

async function maybeRequest() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    TRACKER.track("Asked for notifications permission")
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if(status == 'granted') {
      TRACKER.track("Notifications permission granted")
    } else {
      TRACKER.track("Notifications permission declined")
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