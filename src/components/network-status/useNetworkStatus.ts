import { useState, useEffect } from 'react'

import { NetworkStatus } from './types'

export const useNetworkStatus = (): NetworkStatus => {
  const isOnline = navigator.onLine
  const [networkStatus, setNetworkStatus] = useState({
    isOnline,
    wasOffline: !isOnline,
  })
  const handleOnline = () => {
    setNetworkStatus((prevState) => ({ ...prevState, isOnline: true }))
  }
  const handleOffline = () => {
    setNetworkStatus((prevState) => ({ ...prevState, isOnline: false, wasOffline: true }))
  }
  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return networkStatus
}
