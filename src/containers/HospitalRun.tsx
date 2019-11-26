import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from 'components/Sidebar'
import Dashboard from './Dashboard'
import Patients from './Patients'
import NewPatient from './NewPatient'
import ViewPatient from './ViewPatient'
import { RootState } from '../store/store'
import Navbar from '../components/Navbar'

const HospitalRun = () => {
  const { title } = useSelector((state: RootState) => state.title)
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
                <Route exact path="/patients" component={Patients} />
                <Route exact path="/patients/new" component={NewPatient} />
                <Route exact path="/patients/:id" component={ViewPatient} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default HospitalRun
