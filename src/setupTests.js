/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import { configure, act } from '@testing-library/react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-canvas-mock'
import { queryCache } from 'react-query'

import './__mocks__/i18next'
import './__mocks__/matchMediaMock'
import './__mocks__/react-i18next'

Enzyme.configure({ adapter: new Adapter() })

// speeds up *ByRole queries a bit, but will need to specify { hidden: false } in some cases
configure({ defaultHidden: true })

jest.setTimeout(10000)

afterEach(() => {
  // This is probably needed, but stuff REALLY blows up
  // jest.restoreAllMocks()
  queryCache.clear()
})

afterEach(() => {
  // eslint-disable-next-line no-underscore-dangle
  if (setTimeout._isMockFunction) {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  }
})
