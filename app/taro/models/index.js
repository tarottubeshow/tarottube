import Schedule from 'taro/models/Schedule'
import Timeslot from 'taro/models/Timeslot'

const MODEL_SPECS = [
  {
    cls: Schedule,
  },
  {
    cls: Timeslot,
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
