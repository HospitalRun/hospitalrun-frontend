import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as patientsDb from '../clients/db/patients-db';
import PatientForm from 'components/PatientForm';

interface Props extends RouteComponentProps {

}

interface State {
  firstName: string
  lastName: string
}


class NewPatient extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);

    this.state = {
      firstName: '',
      lastName: '',
    };
  }


  onFieldChange(key: string, value: string) {
    this.setState((prevState) => {
      (prevState as any)[key] = value;
    });
  }

  async onSaveButtonClick() {
    const newPatient = (await patientsDb.save(this.state)) as any
    this.props.history.push(`/patients/${newPatient.id}`);
  }

  onCancelButtonClick() {
    this.props.history.push(`/patients`);
  }

  render() {
    return (
      <div>
        <h1>New Patient</h1>
        <div className="container">
          <PatientForm 
            onFieldChange={this.onFieldChange} 
            onSaveButtonClick={this.onSaveButtonClick}
            onCancelButtonClick={this.onCancelButtonClick}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(NewPatient);