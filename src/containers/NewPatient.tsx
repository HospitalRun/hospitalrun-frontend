import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { createPatient } from 'slices/patients-slice'
import Patient from 'model/Patient'
import PatientForm from 'components/PatientForm'

const NewPatient = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [patient, setPatient] = useState({ firstName: '', lastName: '' })

  const onSaveButtonClick = async () => {
    dispatch(createPatient(patient as Patient, history))
  }

  const onCancelButtonClick = () => {
    history.push(`/patients`)
  }

  const onFieldChange = (key: string, value: string) => {
    setPatient({
      ...patient,
      [key]: value,
    })
  }

  return (
    <div>
      <h1>New Patient</h1>
      <div className="container">
        <PatientForm
          onFieldChange={onFieldChange}
          onSaveButtonClick={onSaveButtonClick}
          onCancelButtonClick={onCancelButtonClick}
        />
      </div>
    </div>
  )
}

export default withRouter(NewPatient)
