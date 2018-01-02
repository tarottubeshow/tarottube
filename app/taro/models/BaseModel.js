import { parseTime } from 'taro/util/timeutil'
import { forceArray } from 'taro/util/iterutil'
import { wrapClass } from 'taro/util/metautil'

class BaseModel {

  static key = null
  static relationships = {}

  static extractId = (target) => {
    return target.id
  }

  static parseToRefs = (cls, data) => {
    const refs = []
    const payload = data
    for(const [key, spec] of Object.entries(cls.relationships)) {
      const raw = data[key] // may be multiple
      payload[key] = spec.map(raw)
      const wrapped = wrapClass(raw, spec.cls)
      const wrappedRefs = forceArray(wrapped)
      refs.push(...wrappedRefs)
    }
    refs.push(new cls(payload)) // last ref is the one of interest
    return refs
  }

  clone = () => {
    return Object.assign({}, this)
  }

  getId = () => {
    return this.id
  }

  _merge = (request, response) => {
    return response
  }

  _makeEnhanceRequest = (request) => {
    return null
  }

  _parseTime = (time) => {
    if(time != null) {
      return parseTime(time)
    }
  }

}

export default BaseModel
