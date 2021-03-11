import { formatDate } from '../../../shared/util/formatDate'

it('should format a valid date provided as a string', () => {
  const formattedDate = formatDate('2020-10-25T12:54:15.353Z')
  expect(formattedDate).toEqual('10/25/2020')
})

it('should format a valid date provided as a Date object', () => {
  const formattedDate = formatDate(new Date('2020-10-25T12:54:15.353Z'))
  expect(formattedDate).toEqual('10/25/2020')
})

it('should return "" when passed undefined', () => {
  const formattedDate = formatDate()
  expect(formattedDate).toEqual('')
})

it('should return "" when passed invalid date string', () => {
  const formattedDate = formatDate('invalid')
  expect(formattedDate).toEqual('')
})

it('should return "" when passed invalid date object', () => {
  const formattedDate = formatDate(new Date('invalid'))
  expect(formattedDate).toEqual('')
})
