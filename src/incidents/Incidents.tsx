import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../breadcrumbs/useAddBreadcrumbs'
import PrivateRoute from '../components/PrivateRoute'
import Permissions from '../model/Permissions'
import { RootState } from '../store'
import ViewIncidents from './list/ViewIncidents'
import ReportIncident from './report/ReportIncident'
import ViewIncident from './view/ViewIncident'

const Incidents = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const breadcrumbs = [
    {
      i18nKey: 'incidents.label',
      location: `/incidents`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewIncidents)}
        exact
        path="/incidents"
        component={ViewIncidents}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ReportIncident)}
        exact
        path="/incidents/new"
        component={ReportIncident}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewIncident)}
        exact
        path="/incidents/:id"
        component={ViewIncident}
      />
    </Switch>
  )
}

export default Incidents
