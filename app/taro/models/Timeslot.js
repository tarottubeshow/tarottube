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
    stream_key,
    unique_key,
    schedule,
    video_url,
  }) {
    super()
    this.id = id
    this.duration = duration
    this.time = time
    this.end_time = end_time
    this.name = name
    this.stream_key = stream_key
    this.unique_key = unique_key
    this.schedule = schedule
    this.video_url = video_url
  }

  getStartTime = () => {
    return this._parseTime(this.time)
  }

  getEndTime = () => {
    return this._parseTime(this.end_time)
  }

  getUri = (quality) => {
    return `${ global.CONFIG.URL.FRAGS }/hls/${ quality }/${ this.stream_key }.m3u8`
  }

}

export default Timeslot
