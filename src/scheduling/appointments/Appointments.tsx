import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router-dom'

import PrivateRoute from '../../components/PrivateRoute'
import Permissions from '../../model/Permissions'
import { RootState } from '../../store'
import EditAppointment from './edit/EditAppointment'
import NewAppointment from './new/NewAppointment'
import ViewAppointment from './view/ViewAppointment'
import ViewAppointments from './ViewAppointments'

const Appointments = () => {
  const permissions = useSelector((state: RootState) => state.user.permissions)
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ReadAppointments)}
        exact
        path="/appointments"
        component={ViewAppointments}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.WriteAppointments)}
        exact
        path="/appointments/new"
        component={NewAppointment}
      />
      <PrivateRoute
        isAuthenticated={
          permissions.includes(Permissions.WriteAppointments) &&
          permissions.includes(Permissions.ReadAppointments)
        }
        exact
        path="/appointments/edit/:id"
        component={EditAppointment}
      />
      <PrivateRoute
        isAuthenticated={permissions.includes(Permissions.ReadAppointments)}
        exact
        path="/appointments/:id"
        component={ViewAppointment}
      />
    </Switch>
  )
}

export default Appointments
