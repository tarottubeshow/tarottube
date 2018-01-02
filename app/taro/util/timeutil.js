import moment from 'moment'

export function parseTime(s) {
  return moment(`${ s }Z`)
}
