export const serialize = (obj = {}) => (
  Object.keys(obj).reduce((total, itemKey) => (
    obj[itemKey] !== null ?
    total.concat([`${ encodeURIComponent(itemKey) }=${ encodeURIComponent(obj[itemKey]) }`]) :
    total
  ), []).join('&')
)

export function resource(path) {
  return `${ window.__CONFIG.URL.BASE }/resource/${ path }`
}
