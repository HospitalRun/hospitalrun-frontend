import React, { useState } from 'react'

import useTranslator from '../../hooks/useTranslator'
import { useNetworkStatus } from './useNetworkStatus'

const ONLINE_COLOR = 'rgba(0, 255, 0, 0.55)'
const OFFLINE_COLOR = 'rgba(255, 0, 0, 0.65)'
const OPACITY_TRANSITION_TIME = 4000
const BASE_STYLE = {
  height: '50px',
  pointerEvents: 'none' as const,
  transition: `opacity ${OPACITY_TRANSITION_TIME}ms ease-in`,
}

export const NetworkStatusMessage = () => {
  const { t } = useTranslator()
  const { isOnline, wasOffline } = useNetworkStatus()
  const [shouldRender, setShouldRender] = useState(true)
  const [opacity, setOpacity] = useState(1)

  if (isOnline && !wasOffline) {
    return null
  }

  if (!isOnline && opacity !== 1) {
    setShouldRender(true)
    setOpacity(1)
  }

  if (isOnline && wasOffline && opacity !== 0) {
    setOpacity(0)
    setTimeout(() => {
      setShouldRender(false)
    }, OPACITY_TRANSITION_TIME)
  }

  if (!shouldRender) {
    return null
  }

  const style = {
    ...BASE_STYLE,
    backgroundColor: isOnline ? ONLINE_COLOR : OFFLINE_COLOR,
    opacity,
  }

  return (
    <div
      className={`fixed-bottom d-flex justify-content-center align-items-center ${
        isOnline ? 'online' : 'offline'
      }`}
      style={style}
    >
      {isOnline ? t('networkStatus.online') : t('networkStatus.offline')}
    </div>
  )
}
