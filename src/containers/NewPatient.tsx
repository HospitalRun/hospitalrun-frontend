import React from 'react'
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createPatient } from '../slices/patient-slice'
import { RootState } from '../store/store'
import PatientForm from '../components/PatientForm'

const NewPatient = (props: RouteComponentProps) => {
  const dispatch = useDispatch()
  const { patient, isCreated } = useSelector((state: RootState) => state.patient)

  const onSaveButtonClick = async () => {
    dispatch(createPatient(patient))
  }

  const onCancelButtonClick = () => {
    const { history } = props
    history.push(`/patients`)
  }

  const onFieldChange = (key: string, value: string) => {
    ;(patient as any)[key] = value
  }

  if (isCreated) {
    return <Redirect to={`/patients/${patient.id}`} />
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
