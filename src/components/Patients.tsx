import React, { Component } from 'react';
import * as patientsDb from '../clients/db/patients-db';

class Patients extends Component {

  async componentDidMount() {
    const patients = await patientsDb.getAll();
    console.log(patients);
  }
  
  render() {
    return (
      <div>
        <h1>Patients</h1>
      </div>

    );
  }
}

export default Patients;