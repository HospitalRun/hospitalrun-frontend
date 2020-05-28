import { Toaster } from '@hospitalrun/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

import Breadcrumbs from './breadcrumbs/Breadcrumbs'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Sidebar from './components/Sidebar'
import Dashboard from './dashboard/Dashboard'
import Incidents from './incidents/Incidents'
import Labs from './labs/Labs'
import { ButtonBarProvider } from './page-header/ButtonBarProvider'
import ButtonToolBar from './page-header/ButtonToolBar'
import Patients from './patients/Patients'
import Appointments from './scheduling/appointments/Appointments'
import Settings from './settings/Settings'
import { RootState } from './store'

const HospitalRun = () => {
  const { title } = useSelector((state: RootState) => state.title)
  const { sidebarCollapsed } = useSelector((state: RootState) => state.components)

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <Sidebar />
        <ButtonBarProvider>
          <div className="row">
            <main
              role="main"
              className={`${
                sidebarCollapsed ? 'col-md-10 col-lg-11' : 'col-md-9 col-lg-10'
              } ml-sm-auto px-4`}
            >
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{title}</h1>
                <ButtonToolBar />
              </div>
              <Breadcrumbs />
              <div>
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <PrivateRoute isAuthenticated path="/appointments" component={Appointments} />
                  <PrivateRoute isAuthenticated path="/patients" component={Patients} />
                  <PrivateRoute isAuthenticated path="/labs" component={Labs} />
                  <PrivateRoute isAuthenticated path="/incidents" component={Incidents} />
                  <PrivateRoute isAuthenticated path="/settings" component={Settings} />
                </Switch>
              </div>
              <Toaster autoClose={5000} hideProgressBar draggable />
            </main>
          </div>
        </ButtonBarProvider>
      </div>
    </div>
  )
}

export default HospitalRun
