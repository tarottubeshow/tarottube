import BaseModel from 'taro/models/BaseModel'
import Timeslot from 'taro/models/Timeslot'

class TimeslotList extends BaseModel {

  static key = 'TimeslotList'

  static extractId = (target) => {
    return '*'
  }

  static relationships = {
    timeslots: {
      cls: Timeslot,
      map: (timeslots) => (
        timeslots.map((timeslot) => ({
          id: timeslot.id,
        }))
      ),
    },
  }

  constructor({
    timeslots,
  }) {
    super()
    this.timeslots = timeslots
  }

  getId = () => {
    return '*'
  }

}

export default TimeslotList
