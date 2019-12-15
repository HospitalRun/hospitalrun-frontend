export default class Name {
  prefix?: string
  given?: string
  family?: string
  suffix?: string

  constructor(prefix?: string, given?: string, family?: string, suffix?: string) {
    this.prefix = prefix
    this.given = given
    this.family = family
    this.suffix = suffix
  }
}
