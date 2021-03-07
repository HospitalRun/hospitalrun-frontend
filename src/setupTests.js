/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import { configure, act } from '@testing-library/react'
import 'jest-canvas-mock'
import { queryCache } from 'react-query'

import './__mocks__/i18next'
import './__mocks__/matchMediaMock'
import './__mocks__/react-i18next'

// speeds up *ByRole queries a bit, but will need to specify { hidden: false } in some cases
configure({ defaultHidden: true })

jest.setTimeout(10000)

afterEach(() => {
  queryCache.clear()
})

afterEach(() => {
  // eslint-disable-next-line no-underscore-dangle
  if (setTimeout._isMockFunction) {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  }
})
