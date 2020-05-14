import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router'

import PrivateRoute from '../components/PrivateRoute'
import Permissions from '../model/Permissions'
import { RootState } from '../store'
import EditPatient from './edit/EditPatient'
import ViewPatients from './list/ViewPatients'
import NewPatient from './new/NewPatient'
import ViewPatient from './view/ViewPatient'

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
