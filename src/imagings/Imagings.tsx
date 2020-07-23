import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../page-header/breadcrumbs/useAddBreadcrumbs'
import PrivateRoute from '../shared/components/PrivateRoute'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import NewImagingRequest from './requests/NewImagingRequest'
import ImagingRequests from './ViewImagings'

const Imagings = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const breadcrumbs = [
    {
      i18nKey: 'imagings.label',
      location: '/imagings',
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewImagings)}
        exact
        path="/imagings"
        component={ImagingRequests}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.RequestImaging)}
        exact
        path="/imagings/new"
        component={NewImagingRequest}
      />
    </Switch>
  )
}

export default Imagings
