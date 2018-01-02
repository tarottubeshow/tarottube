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

export function wrapClass(obj, cls) {
  if (obj == null) {
    return null
  } else if(Array.isArray(obj)) {
    return obj.map(x => wrapClass(x, cls))
  } else if(obj instanceof cls) {
    return obj
  } else {
    return new cls(obj)
  }
}
