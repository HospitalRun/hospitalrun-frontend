import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import { RootState } from '../../shared/store'
import ViewIncidentDetails from './ViewIncidentDetails'

const ViewIncident = () => {
  const { id } = useParams()
  const { permissions } = useSelector((root: RootState) => root.user)
  useTitle('View Incident')
  useAddBreadcrumbs([
    {
      i18nKey: 'View Incident',
      location: `/incidents/${id}`,
    },
  ])

  if (id === undefined || permissions === undefined) {
    return <></>
  }

  return <ViewIncidentDetails incidentId={id} permissions={permissions} />
}

export default ViewIncident
