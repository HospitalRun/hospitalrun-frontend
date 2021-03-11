import getTime from 'date-fns/getTime'

export function getTimestampId() {
  return getTime(new Date()).toString()
}
