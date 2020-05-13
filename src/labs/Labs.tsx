import React from 'react'
import PrivateRoute from 'components/PrivateRoute'
import { Switch } from 'react-router-dom'
import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'
import { useSelector } from 'react-redux'
import Permissions from 'model/Permissions'
import LabRequests from './ViewLabs'
import NewLabRequest from './requests/NewLabRequest'
import ViewLab from './ViewLab'
import { RootState } from '../store'

const Labs = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const breadcrumbs = [
    {
      i18nKey: 'labs.label',
      location: `/labs`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewLabs)}
        exact
        path="/labs"
        component={LabRequests}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.RequestLab)}
        exact
        path="/labs/new"
        component={NewLabRequest}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewLab)}
        exact
        path="/labs/:id"
        component={ViewLab}
      />
    </Switch>
  )
}

export default Labs
