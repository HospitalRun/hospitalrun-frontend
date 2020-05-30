import { render, shallow } from 'enzyme'
import React from 'react'

import {
  NetworkStatusMessage,
  OFFLINE_MESSAGE,
  ONLINE_MESSAGE,
} from '../../../components/network-status/NetworkStatusMessage'

describe('NetworkStatusMessage', () => {
  it('returns null if the app has always been online', () => {
    const wrapper = shallow(<NetworkStatusMessage online wasOffline={false} />)
    expect(wrapper.equals(null as any)).toBe(true)
  })
  it(`shows the message "${OFFLINE_MESSAGE}" if the app goes offline`, () => {
    const wrapper = render(<NetworkStatusMessage online={false} wasOffline={false} />)
    expect(wrapper.text()).toContain(OFFLINE_MESSAGE)
  })
  it(`shows the message "${ONLINE_MESSAGE}" if the app goes back online after it was offline`, () => {
    const wrapper = render(<NetworkStatusMessage online wasOffline />)
    expect(wrapper.text()).toContain(ONLINE_MESSAGE)
  })
})
