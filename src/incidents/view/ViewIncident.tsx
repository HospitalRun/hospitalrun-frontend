import React from 'react'
import { useParams } from 'react-router-dom'

import ViewIncidentDetails from './ViewIncidentDetails'

const ViewIncident = () => {
  const { id } = useParams()

  return <ViewIncidentDetails incidentId={id} />
}

export default ViewIncident
