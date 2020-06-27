/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import './__mocks__/i18next'
import './__mocks__/matchMediaMock'
import './__mocks__/react-i18next'

Enzyme.configure({ adapter: new Adapter() })
