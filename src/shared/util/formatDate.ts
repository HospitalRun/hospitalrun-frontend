import format from 'date-fns/format'

export const formatDate = (date?: string | Date) => {
  if (!date) {
    return ''
  }
  const dateObject = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(dateObject.getTime())) {
    return ''
  }
  return format(dateObject, 'MM/dd/yyyy')
}
