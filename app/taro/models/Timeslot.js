import BaseModel from 'taro/models/BaseModel'
import Schedule from 'taro/models/Schedule'

class Timeslot extends BaseModel {

  static key = 'Timeslot'

  static relationships = {
    schedule: {
      cls: Schedule,
    },
  }

  constructor({
    id,
    duration,
    time,
    end_time,
    name,
    playlists,
    stream_key,
    unique_key,
    schedule,
  }) {
    super()
    this.id = id
    this.duration = duration
    this.time = time
    this.end_time = end_time
    this.name = name
    this.playlists = playlists
    this.stream_key = stream_key
    this.unique_key = unique_key
    this.schedule = schedule
  }

  getStartTime = () => {
    return this._parseTime(this.time)
  }

  getEndTime = () => {
    return this._parseTime(this.end_time)
  }

  isReady = (quality) => {
    if(this.playlists == null) {
      return false
    }
  }

}

export default Timeslot
