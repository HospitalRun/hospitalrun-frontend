import React from 'react'
import PrivateRoute from 'components/PrivateRoute'
import { Switch } from 'react-router'
import LabRequests from './requests/LabRequests'

const Labs = () => (
  <Switch>
    <PrivateRoute isAuthenticated exact path="/labs" component={LabRequests} />
  </Switch>
)

export default Labs
