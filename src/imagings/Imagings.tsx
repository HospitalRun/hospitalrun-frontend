import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../page-header/breadcrumbs/useAddBreadcrumbs'
import PrivateRoute from '../shared/components/PrivateRoute'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import NewImagingRequest from './requests/NewImagingRequest'
import ImagingRequests from './search/ViewImagings'

const Imagings = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const breadcrumbs = [
    {
      i18nKey: 'imagings.imaging.label',
      location: '/imaging',
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewImagings)}
        exact
        path="/imaging"
        component={ImagingRequests}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.RequestImaging)}
        exact
        path="/imaging/new"
        component={NewImagingRequest}
      />
    </Switch>
  )
}

export default Imagings
