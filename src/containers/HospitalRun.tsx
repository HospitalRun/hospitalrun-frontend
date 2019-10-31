import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Navbar } from '@hospitalrun/components';
import Dashboard from './Dashboard';
import Patients from './Patients';
import NewPatient from './NewPatient';
import ViewPatient from 'containers/ViewPatient';

class HospitalRun extends Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.noOpHandler = this.noOpHandler.bind(this);
  }

  noOpHandler() {
    console.log('no op');
  }

  navigate(route: string) {
    this.props.history.push(route);
  }

  render() {
    return (
      <div>
        <Navbar
          brand={{
            label: 'HospitalRun',
            onClick: () => {this.navigate('/')}
          }}
          bg="light"
          variant="light"
          onSeachButtonClick={this.noOpHandler}
          onSearchTextBoxChange={this.noOpHandler}
          navLinks={[{ label: 'Patients', onClick: () => {this.navigate('/patients')}, children: [] }]}
        />
        <div>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/patients" component={Patients} />
            <Route exact path="/new/patient" component={NewPatient} />
            <Route exact path="/patients/:id" component={ViewPatient} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(HospitalRun);