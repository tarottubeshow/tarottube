import BaseModel from 'taro/models/BaseModel'

class Schedule extends BaseModel {

  static key = 'Schedule'

  constructor({
    id,
    name,
    duration,
  }) {
    super()
    this.id = id
    this.name = name
    this.duration = duration
  }

}

export default Schedule
