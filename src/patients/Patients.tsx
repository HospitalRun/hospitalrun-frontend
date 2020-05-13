import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router'

import PrivateRoute from 'components/PrivateRoute'
import Permissions from 'model/Permissions'
import EditPatient from 'patients/edit/EditPatient'
import ViewPatients from 'patients/list/ViewPatients'
import NewPatient from 'patients/new/NewPatient'
import ViewPatient from 'patients/view/ViewPatient'
import { RootState } from 'store'

const Patients = () => {
  const permissions = useSelector((state: RootState) => state.user.permissions)
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ReadPatients)}
        exact
        path="/patients"
        component={ViewPatients}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.WritePatients)}
        exact
        path="/patients/new"
        component={NewPatient}
      />
      <PrivateRoute
        isAuthenticated={
          permissions.includes(Permissions.WritePatients) &&
          permissions.includes(Permissions.ReadPatients)
        }
        exact
        path="/patients/edit/:id"
        component={EditPatient}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ReadPatients)}
        path="/patients/:id"
        component={ViewPatient}
      />
    </Switch>
  )
}

export default Patients
