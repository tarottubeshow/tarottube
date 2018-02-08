import * as Api from 'taro/api/Api'

// TODO: this is all heavily archive focused and not very useful

import TimeslotList from 'taro/models/TimeslotList'

const TIMESLOT_API = Api.makeApiWrapper('taro.Timeslots', {

  get: () => Api.get({
    path: `timeslots`,
    cls: TimeslotList,
  }),

  logView: ({
    timeslot, // stream key
    type,
    uuid,
  }) => Api.post({
    path: `timeslot/log-view`,
    data: {
      timeslot,
      type,
      uuid,
    },
  }),

})

export default TIMESLOT_API
