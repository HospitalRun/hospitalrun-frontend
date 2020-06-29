import shortid from 'shortid'

const generateCode = (prefix: string) => {
  const id = shortid.generate()
  return `${prefix}-${id}`
}

export default generateCode
