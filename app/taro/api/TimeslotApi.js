import * as Api from 'taro/api/Api'

import Timeslot from 'taro/models/Timeslot'
import TimeslotList from 'taro/models/TimeslotList'

const TIMESLOT_API = Api.makeApiWrapper('taro.Timeslots', {

  get: () => Api.get({
    path: `timeslots`,
    cls: TimeslotList,
  }),

  getLatest: () => Api.get({
    path: `timeslot/latest`,
    cls: Timeslot,
    map: (data) => (data.timeslot),
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
