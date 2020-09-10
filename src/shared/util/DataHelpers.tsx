import { Parser } from 'json2csv'

export function getCSV<T>(data: T[]): string {
  const fields = Object.keys(data[0])
  const opts = { fields }
  const parser = new Parser(opts)
  const csv = parser.parse(data)
  return csv
}

export function DownloadLink(data: string, fileName: string) {
  const text = data
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', fileName)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()

  return document.body.removeChild(element)
}
