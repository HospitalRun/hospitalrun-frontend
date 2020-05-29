import React from 'react'

import './styles.css'

interface Props {
  online: boolean
}

const OFFLINE_MESSAGE = 'you are working in offline mode'
const ONLINE_MESSAGE = 'you are back online'

export const NetworkStatusMessage = (props: Props) => {
  const { online } = props

  return (
    <div className={`offline-indicator ${online ? 'online' : 'offline'}`}>
      {online ? ONLINE_MESSAGE : OFFLINE_MESSAGE}
    </div>
  )
}
