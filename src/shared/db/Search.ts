export default class Search {
  searchString: string

  fields: string[]

  constructor(searchString: string, fields: string[]) {
    this.searchString = searchString
    this.fields = fields
  }
}
