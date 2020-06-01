import { useState, useEffect } from 'react'

import { NetworkStatus } from './types'

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    wasOffline: false,
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
