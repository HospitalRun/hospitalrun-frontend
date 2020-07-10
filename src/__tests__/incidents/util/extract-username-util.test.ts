import { extractUsername } from '../../../incidents/util/extractUsername'

it('should extract the string after the last : in a given string', () => {
  const extractedName = extractUsername('org.couchdb.user:username')
  expect(extractedName).toMatch('username')
})
