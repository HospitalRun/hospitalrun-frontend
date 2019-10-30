import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TextInput, Button } from '@hospitalrun/components';
import * as patientsDb from '../clients/db/patients-db';

interface Props extends RouteComponentProps {

}

interface State {
  firstName: string
  lastName: string
}


class NewPatient extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.onFirstNameChange = this.onFirstNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);

    this.state = {
      firstName: '',
      lastName: '',
    };
  }


  onFirstNameChange(event: any) {
    this.setState({
      firstName: event.target.value,
    })
  }

  onLastNameChange(event: any) {
    this.setState({
      lastName: event.target.value,
    })
  } 

  async onSaveButtonClick() {
    const newPatient = (await patientsDb.save(this.state)) as any
    this.props.history.push(`/patients/${newPatient.id}`);
  }

  render() {
    return (
      <div>
        <h1>New Patient</h1>
        <div className="container">
          <form>
            <div className="row">
              <h3>First Name:</h3>
              <TextInput onChange={this.onFirstNameChange}/>
            </div>
            <div className="row">
              <h3>Last Name:</h3>
              <TextInput onChange={this.onLastNameChange}/>
            </div>
            <Button onClick={this.onSaveButtonClick}>Save</Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewPatient);