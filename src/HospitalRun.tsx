import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from '@hospitalrun/components'
import Sidebar from './components/Sidebar'
import Permissions from './model/Permissions'
import Dashboard from './dashboard/Dashboard'
import Patients from './patients/list/Patients'
import NewPatient from './patients/new/NewPatient'
import ViewPatient from './patients/view/ViewPatient'
import { RootState } from './store'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

const HospitalRun = () => {
  const { title } = useSelector((state: RootState) => state.title)
  const { permissions } = useSelector((state: RootState) => state.user)
  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <Sidebar />
        <div className="row">
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{title}</h1>
            </div>
            <div>
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <PrivateRoute
                  isAuthenticated={permissions.includes(Permissions.ReadPatients)}
                  exact
                  path="/patients"
                  component={Patients}
                />
                <PrivateRoute
                  isAuthenticated={permissions.includes(Permissions.WritePatients)}
                  exact
                  path="/patients/new"
                  component={NewPatient}
                />
                <PrivateRoute
                  isAuthenticated={permissions.includes(Permissions.ReadPatients)}
                  exact
                  path="/patients/:id"
                  component={ViewPatient}
                />
              </Switch>
            </div>
            <Toaster autoClose={5000} hideProgressBar draggable />
          </main>
        </div>
      </div>
    </div>
  )
}

export default HospitalRun
