/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-canvas-mock'

import './__mocks__/i18next'
import './__mocks__/matchMediaMock'
import './__mocks__/react-i18next'

Enzyme.configure({ adapter: new Adapter() })
// eslint-disable-next-line import/no-extraneous-dependencies
