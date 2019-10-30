import React, { Component } from 'react';
import * as patientsDb from '../clients/db/patients-db';
import { Link } from 'react-router-dom';

interface Props {

}

interface State {
  patients: any[],
}


class Patients extends Component<Props, State> {

  constructor(props: Props) { 
    super(props);
    this.state = {
      patients: [],
    }
  }

  async componentDidMount() {
    const patients = await patientsDb.getAll();
    this.setState({
      patients: patients.rows,
    })
  }
  
  render() {
    const list = (
      <ul>
        {this.state.patients.map((patient) =>
          <Link to={`/patients/${patient.id}`}>
            <li key={patient.id}>
              {patient.doc.firstName} {patient.doc.lastName}
            </li>
          </Link>
        )}
      </ul>
    );

    return (
      <div>
        <h1>Patients</h1>
        <div className="container">
          <ul>
            {list}
          </ul>
        </div>

      </div>
    );
  }
}

export default Patients;