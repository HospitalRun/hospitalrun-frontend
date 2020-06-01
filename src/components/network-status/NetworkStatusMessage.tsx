import React, { useState } from 'react'

import { useNetworkStatus } from './useNetworkStatus'
import './styles.css'

export const OFFLINE_MESSAGE = 'you are working in offline mode'
export const ONLINE_MESSAGE = 'you are back online'
const OPACITY_TRANSITION_TIME = 4000

export const NetworkStatusMessage = () => {
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
      {isOnline ? ONLINE_MESSAGE : OFFLINE_MESSAGE}
    </div>
  )
}
