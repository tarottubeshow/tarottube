import BaseModel from 'taro/models/BaseModel'
import Schedule from 'taro/models/Schedule'
import { reach } from 'taro/util/metautil'

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

  getDuration = (quality) => {
    return reach(this.playlists, [`m3u8:${ quality }`, 'duration'])
  }

  getUri = (quality) => {
    let qualitySuffix
    if(quality !== 'high') {
      qualitySuffix = `_${ quality }`
    } else {
      qualitySuffix = ''
    }
    return `${ global.CONFIG.URL.HLS }/${ this.stream_key }${ qualitySuffix }.m3u8`
  }

  isReady = (quality) => {
    const playlist = reach(this.playlists, [`m3u8:${ quality }`])
    return playlist != null
  }

  isStreaming = (quality) => {
    return reach(this.playlists, [`rtmp:${ quality }`, 'streaming'])
  }

}

export default Timeslot
