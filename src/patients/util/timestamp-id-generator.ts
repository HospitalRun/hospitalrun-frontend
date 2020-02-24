import { getTime } from 'date-fns'

export function getTimestampId() {
  return getTime(new Date()).toString()
}
