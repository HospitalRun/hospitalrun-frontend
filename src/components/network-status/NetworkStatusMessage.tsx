import React, { useState } from 'react'

import './styles.css'

interface Props {
  online: boolean
  wasOffline: boolean
}

const OFFLINE_MESSAGE = 'you are working in offline mode'
const ONLINE_MESSAGE = 'you are back online'
const OPACITY_TRANSITION_TIME = 4000

export const NetworkStatusMessage = (props: Props) => {
  const { online, wasOffline } = props
  const [display, setDisplay] = useState('flex')
  const [opacity, setOpacity] = useState(1)

  if (online && !wasOffline) {
    return null
  }

  if (!online && opacity !== 1) {
    setDisplay('flex')
    setOpacity(1)
  }

  if (online && wasOffline && opacity !== 0) {
    setOpacity(0)
    setTimeout(() => {
      setDisplay('none')
    }, OPACITY_TRANSITION_TIME)
  }

  return (
    <div
      className={`network-status-message ${online ? 'online' : 'offline'}`}
      style={{ display, opacity, transition: `opacity ${OPACITY_TRANSITION_TIME}ms ease-in` }}
    >
      {online ? ONLINE_MESSAGE : OFFLINE_MESSAGE}
    </div>
  )
}
