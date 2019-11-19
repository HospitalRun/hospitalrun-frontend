import React, { Component } from 'react'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom'
import { Navbar } from '@hospitalrun/components'
import ViewPatient from './ViewPatient'
import Dashboard from './Dashboard'
import Patients from './Patients'
import NewPatient from './NewPatient'

class HospitalRun extends Component<RouteComponentProps, {}> {
  navigate(route: string) {
    const { history } = this.props
    history.push(route)
  }

  render() {
    return (
      <div>
        <Navbar
          brand={{
            label: 'HospitalRun',
            onClick: () => {
              this.navigate('/')
            },
          }}
          bg="light"
          variant="light"
          onSeachButtonClick={() => console.log('hello')}
          onSearchTextBoxChange={() => console.log('hello')}
          navLinks={[
            {
              label: 'Patients',
              onClick: () => {},
              children: [
                {
                  label: 'List',
                  onClick: () => {
                    this.navigate('/patients')
                  },
                },
                {
                  label: 'New',
                  onClick: () => {
                    this.navigate('/patients/new')
                  },
                },
              ],
            },
          ]}
        />
        <div>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/patients" component={Patients} />
            <Route exact path="/patients/new" component={NewPatient} />
            <Route exact path="/patients/:id" component={ViewPatient} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(HospitalRun)
