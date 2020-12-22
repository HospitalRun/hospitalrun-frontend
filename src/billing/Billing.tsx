import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../page-header/breadcrumbs/useAddBreadcrumbs'
import PrivateRoute from '../shared/components/PrivateRoute'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import AddPricingItem from './new/AddPricingItem'
import ViewPricingItem from './view/ViewPricingItem'
import ViewPricingItems from './view/ViewPricingItems'

const Billing = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const breadcrumbs = [
    {
      i18nKey: 'billing.label',
      location: '/billing',
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewPricingItems)}
        exact
        path="/billing"
        component={ViewPricingItems}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.AddPricingItems)}
        exact
        path="/billing/new"
        component={AddPricingItem}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewPricingItems)}
        exact
        path="/billing/:id"
        component={ViewPricingItem}
      />
    </Switch>
  )
}

export default Billing
