import React, { useState, useEffect } from 'react'

import { NetworkStatusMessage } from './NetworkStatusMessage'

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const setOnline = () => setIsOnline(true)
  const setOffline = () => setIsOnline(false)
  useEffect(() => {
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    return () => {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
    }
  }, [])

  return <NetworkStatusMessage online={isOnline} />
}
