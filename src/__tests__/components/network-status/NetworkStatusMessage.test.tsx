import { render, shallow } from 'enzyme'
import React from 'react'

import { useTranslation } from '../../../__mocks__/react-i18next'
import { NetworkStatusMessage } from '../../../components/network-status'
import { useNetworkStatus } from '../../../components/network-status/useNetworkStatus'

jest.mock('../../../components/network-status/useNetworkStatus')
const useNetworkStatusMock = (useNetworkStatus as unknown) as jest.MockInstance<
  ReturnType<typeof useNetworkStatus>,
  any
>

const englishTranslationsMock = {
  'networkStatus.offline': 'you are working in offline mode',
  'networkStatus.online': 'you are back online',
}

const useTranslationReturnValue = useTranslation() as any
useTranslationReturnValue.t = (key: keyof typeof englishTranslationsMock) =>
  englishTranslationsMock[key]
const { t } = useTranslationReturnValue

describe('NetworkStatusMessage', () => {
  it('returns null if the app has always been online', () => {
    useNetworkStatusMock.mockReturnValue({
      isOnline: true,
      wasOffline: false,
    })
    const wrapper = shallow(<NetworkStatusMessage />)
    expect(wrapper.equals(null as any)).toBe(true)
  })
  it(`shows the message "${t('networkStatus.offline')}" if the app goes offline`, () => {
    useNetworkStatusMock.mockReturnValue({
      isOnline: false,
      wasOffline: false,
    })
    const wrapper = render(<NetworkStatusMessage />)
    expect(wrapper.text()).toContain(t('networkStatus.offline'))
  })
  it(`shows the message "${t(
    'networkStatus.online',
  )}" if the app goes back online after it was offline`, () => {
    useNetworkStatusMock.mockReturnValue({
      isOnline: true,
      wasOffline: true,
    })
    const wrapper = render(<NetworkStatusMessage />)
    expect(wrapper.text()).toContain(t('networkStatus.online'))
  })
})
