import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import PatientForm from '../components/PatientForm'
import * as patientsDb from '../clients/db/patients-db'
import Patient from 'model/Patient'

interface Props extends RouteComponentProps {}

interface State {
  firstName: string
  lastName: string
}

class NewPatient extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.onFieldChange = this.onFieldChange.bind(this)
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this)

    this.state = {
      firstName: '',
      lastName: '',
    }
  }

  onFieldChange(key: string, value: string) {
    this.setState((prevState) => {
      (prevState as any)[key] = value
    })
  }

  async onSaveButtonClick() {
    const { history } = this.props
    const createdPatient = await patientsDb.save(this.state as Patient)
    history.push(`/patients/${createdPatient.id}`)
  }

  onCancelButtonClick() {
    const { history } = this.props
    history.push(`/patients`)
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
    )
  }
}

export default withRouter(NewPatient)
