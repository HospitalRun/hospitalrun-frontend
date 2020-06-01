import { render, shallow } from 'enzyme'
import React from 'react'

import { NetworkStatusMessage } from '../../../components/network-status'
import {
  OFFLINE_MESSAGE,
  ONLINE_MESSAGE,
} from '../../../components/network-status/NetworkStatusMessage'
import { useNetworkStatus } from '../../../components/network-status/useNetworkStatus'

jest.mock('../../../components/network-status/useNetworkStatus')
const useNetworkStatusCast = (useNetworkStatus as unknown) as jest.MockInstance<
  ReturnType<typeof useNetworkStatus>,
  any
>

describe('NetworkStatusMessage', () => {
  it('returns null if the app has always been online', () => {
    useNetworkStatusCast.mockReturnValue({
      isOnline: true,
      wasOffline: false,
    })
    const wrapper = shallow(<NetworkStatusMessage />)
    expect(wrapper.equals(null as any)).toBe(true)
  })
  it(`shows the message "${OFFLINE_MESSAGE}" if the app goes offline`, () => {
    useNetworkStatusCast.mockReturnValue({
      isOnline: false,
      wasOffline: false,
    })
    const wrapper = render(<NetworkStatusMessage />)
    expect(wrapper.text()).toContain(OFFLINE_MESSAGE)
  })
  it(`shows the message "${ONLINE_MESSAGE}" if the app goes back online after it was offline`, () => {
    useNetworkStatusCast.mockReturnValue({
      isOnline: true,
      wasOffline: true,
    })
    const wrapper = render(<NetworkStatusMessage />)
    expect(wrapper.text()).toContain(ONLINE_MESSAGE)
  })
})
