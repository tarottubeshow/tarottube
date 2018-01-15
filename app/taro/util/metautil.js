import { get as lodashGet } from 'lodash/object'

export function applyHocs(component, ...hocs) {
  for(const hoc of hocs) {
    component = hoc(component)
  }
  return component
}

export function getConfig() {
  return global.CONFIG
}

export const reach = lodashGet

export function wrapClass(obj, cls, wrapRel=false) {
  if (obj == null) {
    return null
  } else if(Array.isArray(obj)) {
    return obj.map(x => wrapClass(x, cls, wrapRel))
  } else if(obj instanceof cls) {
    return obj
  } else {
    if(wrapRel) {
      obj = {...obj}
      for(const relKey in cls.relationships) {
        const relSpec = cls.relationships[relKey]
        obj[relKey] = wrapClass(obj[relKey], relSpec.cls, true)
      }
    }
    return new cls(obj)
  }
}
