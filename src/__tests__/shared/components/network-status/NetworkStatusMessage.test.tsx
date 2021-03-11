import { render } from '@testing-library/react'
import React from 'react'

import { useTranslation } from '../../../../__mocks__/react-i18next'
import { NetworkStatusMessage } from '../../../../shared/components/network-status'
import { useNetworkStatus } from '../../../../shared/components/network-status/useNetworkStatus'

jest.mock('../../../../shared/components/network-status/useNetworkStatus')

describe('NetworkStatusMessage', () => {
  const useNetworkStatusMock = (useNetworkStatus as unknown) as jest.MockInstance<
    ReturnType<typeof useNetworkStatus>,
    any
  >

  const englishTranslationsMock = {
    'networkStatus.offline': 'you are working in offline mode',
    'networkStatus.online': 'you are back online',
  }

  const t = (key: keyof typeof englishTranslationsMock) => englishTranslationsMock[key]

  beforeEach(() => {
    const mockTranslation = useTranslation() as any
    mockTranslation.t = t
  })

  it('returns null if the app has always been online', () => {
    useNetworkStatusMock.mockReturnValue({
      isOnline: true,
      wasOffline: false,
    })
    const { container } = render(<NetworkStatusMessage />)

    expect(container).toBeEmptyDOMElement()
  })
  it(`shows the message "${t('networkStatus.offline')}" if the app goes offline`, () => {
    useNetworkStatusMock.mockReturnValue({
      isOnline: false,
      wasOffline: false,
    })
    const { container } = render(<NetworkStatusMessage />)
    expect(container).toHaveTextContent(t('networkStatus.offline'))
  })
  it(`shows the message "${t(
    'networkStatus.online',
  )}" if the app goes back online after it was offline`, () => {
    useNetworkStatusMock.mockReturnValue({
      isOnline: true,
      wasOffline: true,
    })
    const { container } = render(<NetworkStatusMessage />)
    expect(container).toHaveTextContent(t('networkStatus.online'))
  })
})
