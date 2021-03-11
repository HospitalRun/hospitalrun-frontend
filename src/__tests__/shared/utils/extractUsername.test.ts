import { extractUsername } from '../../../shared/util/extractUsername'

describe('extract username util', () => {
  it('should extract the string after the last : in a given string', () => {
    const extractedName = extractUsername('org.couchdb.user:username')
    expect(extractedName).toMatch('username')
  })

  it('should return the string if string does not contain a : ', () => {
    const extractedName = extractUsername('username')
    expect(extractedName).toMatch('username')
  })
})
