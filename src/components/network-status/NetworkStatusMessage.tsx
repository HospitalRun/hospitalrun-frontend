import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNetworkStatus } from './useNetworkStatus'
import './styles.css'

const OPACITY_TRANSITION_TIME = 4000

export const NetworkStatusMessage = () => {
  const { t } = useTranslation()
  const { isOnline, wasOffline } = useNetworkStatus()
  const [display, setDisplay] = useState('flex')
  const [opacity, setOpacity] = useState(1)

  if (isOnline && !wasOffline) {
    return null
  }

  if (!isOnline && opacity !== 1) {
    setDisplay('flex')
    setOpacity(1)
  }

  if (isOnline && wasOffline && opacity !== 0) {
    setOpacity(0)
    setTimeout(() => {
      setDisplay('none')
    }, OPACITY_TRANSITION_TIME)
  }

  return (
    <div
      className={`network-status-message ${isOnline ? 'online' : 'offline'}`}
      style={{ display, opacity, transition: `opacity ${OPACITY_TRANSITION_TIME}ms ease-in` }}
    >
      {isOnline ? t('networkStatus.online') : t('networkStatus.offline')}
    </div>
  )
}
