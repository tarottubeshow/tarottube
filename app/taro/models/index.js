import Faq from 'taro/models/Faq'
import FaqList from 'taro/models/FaqList'
import Schedule from 'taro/models/Schedule'
import Timeslot from 'taro/models/Timeslot'
import TimeslotList from 'taro/models/TimeslotList'

import FAQ_API from 'taro/api/FaqApi'
import TIMESLOT_API from 'taro/api/TimeslotApi'

const MODEL_SPECS = [
  {
    cls: Schedule,
  },
  {
    cls: Timeslot,
  },
  {
    cls: Faq,
  },
  {
    cls: FaqList,
    api: FAQ_API.get,
  },
  {
    cls: TimeslotList,
    api: TIMESLOT_API.get,
  },
]

const makeModelSpecMap = (specs) => {
  const map = {}
  for(const spec of specs) {
    map[spec.cls.key] = spec
  }
  return map
}

const MODEL_SPEC_MAP = makeModelSpecMap(MODEL_SPECS)

const getSpec = (cls) => {
  return MODEL_SPEC_MAP[cls.key]
}

export {
  getSpec,
  MODEL_SPECS,
  MODEL_SPEC_MAP,
}
