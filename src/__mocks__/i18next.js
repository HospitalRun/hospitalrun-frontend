const i18next = jest.genMockFromModule('i18next')

function use() {
  return this
}

const t = (k) => k

i18next.use = use
i18next.t = t

module.exports = i18next
