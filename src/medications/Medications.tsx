import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../page-header/breadcrumbs/useAddBreadcrumbs'
import PrivateRoute from '../shared/components/PrivateRoute'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import NewMedicationRequest from './requests/NewMedicationRequest'
import MedicationRequests from './search/ViewMedications'
import ViewMedication from './ViewMedication'

const Medications = () => {
  const { permissions } = useSelector((state: RootState) => state.user)
  const breadcrumbs = [
    {
      i18nKey: 'medications.label',
      location: `/medications`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewMedications)}
        exact
        path="/medications"
        component={MedicationRequests}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.RequestMedication)}
        exact
        path="/medications/new"
        component={NewMedicationRequest}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ViewMedication)}
        exact
        path="/medications/:id"
        component={ViewMedication}
      />
    </Switch>
  )
}

export default Medications
