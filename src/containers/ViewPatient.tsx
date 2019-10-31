import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Alert } from '@hospitalrun/components';
import * as patientsDb from '../clients/db/patients-db';
import PatientForm from 'components/PatientForm';

interface Props extends RouteComponentProps {
  patient: { firstName: string, lastName: string, id: string,}
}

interface State {
  isEditable: boolean,
  showSuccess: boolean,
  patient: { firstName: string, lastName: string, id: string }
}

class ViewPatient extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);

    this.state ={
      showSuccess: false,
      isEditable: false,
      patient: props.patient,
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params as any;
    const patient = await patientsDb.get(id) as any;
    this.setState({
      patient: patient
    })
  }

  onFieldChange(key: string, value: string) {
    this.setState((prevState) => {
      (prevState.patient as any)[key] = value;
    });
  }

  onEditButtonClick() {
    this.setState(prevState => ({
      isEditable: !prevState.isEditable
    }));
  }

  async onSaveButtonClick() {
    const newPatient = (await patientsDb.saveOrUpdate(this.state.patient)) as any
    const patient = await patientsDb.get(newPatient.id) as any;
    this.setState({
      showSuccess: true,
      patient: patient,
      isEditable: false,
    })
  }

  onCancelButtonClick() {
    this.props.history.push(`/patients`);
  }

  render() {
    const { isEditable, patient, showSuccess } = this.state;
    return (
      <div className="container">
        <Button onClick={this.onEditButtonClick}>Edit</Button>

        {showSuccess &&
          <Alert color="success" title="Successfully Updated" message={`Successfully updated ${patient.firstName} ${patient.lastName}`} />
        }

        <PatientForm 
          isEditable={isEditable} 
          onFieldChange={this.onFieldChange} 
          onSaveButtonClick={this.onSaveButtonClick}
          onCancelButtonClick={this.onCancelButtonClick}
          patient={patient}
        />
      </div>
    );
  }
}

export default withRouter(ViewPatient);