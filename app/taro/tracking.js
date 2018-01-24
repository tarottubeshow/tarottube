import uniqueId from 'react-native-unique-id'
import base64 from 'base-64'

class Tracker {

  constructor() {
  }

  async track(event, properties) {
    const guid = await uniqueId()
    const payload = {
      event: event,
      properties: {
        token: global.CONFIG.MIXPANEL.token,
        distinct_id: guid,
        ...properties,
      }
    }
    console.log(payload)
    const encoded = base64.encode(JSON.stringify(payload))
    const uri = `http://api.mixpanel.com/track/?data=${ encoded }`
    response = await fetch(uri, {
      url: uri,
      method: 'GET',
    })
  }

}

const TRACKER = new Tracker()
export default TRACKER
