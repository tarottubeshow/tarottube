const MODEL_SPECS = [
  // {
  //   cls: Lead,
  //   api: LEAD_API.get,
  // },
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
