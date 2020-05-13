import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router'

import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'
import PrivateRoute from 'components/PrivateRoute'
import NewLabRequest from 'labs/requests/NewLabRequest'
import ViewLab from 'labs/ViewLab'
import LabRequests from 'labs/ViewLabs'
import Permissions from 'model/Permissions'
import { RootState } from 'store'

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
