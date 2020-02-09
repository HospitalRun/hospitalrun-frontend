import React from 'react'
import { Switch, Route } from 'react-router'
import DefaultBreadcrumb from 'components/breadcrumb/DefaultBreadcrumb'
import PatientBreadcrumb from 'components/breadcrumb/PatientBreadcrumb'
import AppointmentBreadcrumb from 'components/breadcrumb/AppointmentBreadcrumb'

const Breadcrumb = () => (
  <Switch>
    <Route exact path={['/patients/new', '/appointments/new']} component={DefaultBreadcrumb} />
    <Route path="/patients/:id" component={PatientBreadcrumb} />
    <Route path="/appointments/:id" component={AppointmentBreadcrumb} />
    <Route path="*" component={DefaultBreadcrumb} />
  </Switch>
)

export default Breadcrumb
