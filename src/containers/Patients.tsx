import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as patientsDb from '../clients/db/patients-db'
import Patient from 'model/Patient'

interface Props {}

interface State {
  patients: Patient[]
}

class Patients extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      patients: [],
    }
  }

  async componentDidMount() {
    const patients = await patientsDb.getAll()
    this.setState({
      patients: patients,
    })
  }

  render() {
    const { patients } = this.state
    const list = (
      <ul>
        {patients.map((p) => (
          <Link to={`/patients/${p.id}`}>
            <li key={p.id}>
              {p.firstName} {p.lastName}
            </li>
          </Link>
        ))}
      </ul>
    )

    return (
      <div>
        <h1>Patients</h1>
        <div className="container">
          <ul>{list}</ul>
        </div>
      </div>
    )
  }
}

export default Patients
