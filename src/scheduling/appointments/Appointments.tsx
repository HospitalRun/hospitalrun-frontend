import React from 'react'
import { useSelector } from 'react-redux'
import { Switch } from 'react-router'

import PrivateRoute from 'components/PrivateRoute'
import Permissions from 'model/Permissions'
import EditAppointment from 'scheduling/appointments/edit/EditAppointment'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import ViewAppointment from 'scheduling/appointments/view/ViewAppointment'
import ViewAppointments from 'scheduling/appointments/ViewAppointments'
import { RootState } from 'store'

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
