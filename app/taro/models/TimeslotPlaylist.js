import BaseModel from 'taro/models/BaseModel'
import { reach } from 'taro/util/metautil'

class TimeslotPlaylist extends BaseModel {

  static key = 'TimeslotPlaylist'

  constructor({
    type,
    quality,
    stream,
    payload,
  }) {
    super()
    this.type = type
    this.quality = quality
    this.stream = stream
    this.payload = payload
  }

  getDuration = () => {
    // applies only to hls
    return this.payload.duration
  }

  getRealTimestamp = (time) => {
    // applies only to hls
    const mappings = this.payload.mapping
    if(mappings != null) {
      for(const entry of mappings) {
        const realTime = entry[0]
        const videoTime = entry[1]
        if(time >= videoTime) {
          const delta = (time - videoTime)
          return new Date(realTime + delta)
        }
      }
    }
  }

  isReady = () => {
    // applies only to hls
    const mappings = this.payload.mapping
    return mappings.length > 1
  }

  isStreaming = () => {
    // applies only to rtmp
    return this.payload.streaming
  }

}

export default TimeslotPlaylist
