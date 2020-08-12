import { Spinner } from '@hospitalrun/components'
import React from 'react'

import useIncidents from '../hooks/useIncidents'
import IncidentFilter from '../IncidentFilter'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

const VisualizeIncidents = () => {
  const searchFilter = IncidentFilter.reported
  const searchRequest: IncidentSearchRequest = { status: searchFilter }
  const { data, isLoading } = useIncidents(searchRequest)

  if (data === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  console.log('data: ', data)
  return (
    <>
      <h1>Hello from Visualize Incidents</h1>
    </>
  )
}

export default VisualizeIncidents
