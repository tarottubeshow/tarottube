import {
  Permissions,
  Notifications,
} from 'expo'

import TRACKER from 'taro/tracking'

import * as NagManager from 'taro/controllers/NagManager'
import NOTIFICATIONS_API from 'taro/api/NotificationsApi'

async function maybeRequest() {
  const granted = await negotiateStatus()
  if(granted) {
    const token = await Notifications.getExpoPushTokenAsync()
    const response = await NOTIFICATIONS_API.subscribe.exec({
      token: token,
    })
  }
}

async function doAsk() {
  await TRACKER.track("Asking for notifications permission")
  try {
    const response = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    return response.status
  } catch(e) {
      await TRACKER.track("Exception asking for permissions", {
        exc: `${ e }`,
      })
      return 'error'
  }
}

async function negotiateStatus() {
  const original = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  if (original.status === 'granted') {
    return true
  }

  const status = await doAsk()

  if(status == 'granted') {
    await TRACKER.track("Notifications permission granted")
    return true
  } else {
    await TRACKER.track("Notifications permission declined", {
        status: status,
    })
    return false
  }
}


export {
  maybeRequest,
}
