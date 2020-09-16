import { getCSV, DownloadLink } from '../../../shared/util/DataHelpers'

describe('Use Data Helpers util', () => {
  it('should construct csv', () => {
    const input = [
      {
        code: 'I-eClU6OdkR',
        date: '2020-09-06 12:02 PM',
        reportedBy: 'some user',
        reportedOn: '2020-09-06 12:02 PM',
        status: 'reported',
      },
    ]
    const output = getCSV(input).replace(/(\r\n|\n|\r)/gm, '')
    const expectedOutput =
      '"code","date","reportedBy","reportedOn","status""I-eClU6OdkR","2020-09-06 12:02 PM","some user","2020-09-06 12:02 PM","reported"'
    expect(output).toMatch(expectedOutput)
  })

  it('should download data as expected', () => {
    const response = DownloadLink('data to be downloaded', 'filename.txt')

    const element = document.createElement('a')
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent('data to be downloaded')}`,
    )
    element.setAttribute('download', 'filename.txt')

    element.style.display = 'none'
    expect(response).toEqual(element)
  })
})
