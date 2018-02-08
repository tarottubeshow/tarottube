import uniqueId from 'react-native-unique-id'

import TIMESLOT_API from 'taro/api/TimeslotApi'

class ViewCounter {

  async onView(streamKey, type) {
    const uuid = await uniqueId()
    await TIMESLOT_API.logView.exec({
      timeslot: streamKey,
      type: type,
      uuid: uuid,
    })
  }

}

const VIEW_COUNTER = new ViewCounter()

export default VIEW_COUNTER
