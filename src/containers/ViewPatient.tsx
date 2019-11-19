import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, Alert } from '@hospitalrun/components'
import { fetchPatient, updatePatient } from '../slices/patient-slice'
import { RootState } from '../store/store'
import Patient from '../model/Patient'
import PatientForm from '../components/PatientForm'

interface Props extends RouteComponentProps {
  patient: Patient
}

const ViewPatient = (props: Props) => {
  const { match } = props
  const { id } = match.params as any
  const dispatch = useDispatch()
  const [isEditable, setIsEditable] = useState(false)
  const { patient, isLoading, isUpdated } = useSelector((state: RootState) => state.patient)

  const onSaveButtonClick = async () => {
    dispatch(updatePatient(patient))
    setIsEditable(false)
  }

  const onCancelButtonClick = () => {
    const { history } = props
    history.push(`/patients`)
  }

  const onEditButtonClick = () => {
    setIsEditable(true)
  }

  const onFieldChange = (key: string, value: string) => {
    ;(patient as any)[key] = value
  }

  useEffect(() => {
    dispatch(fetchPatient(id))
  }, [dispatch, id])

  if (isLoading) {
    return <h3>Loading...</h3>
  }

  return (
    <div className="container">
      <Button onClick={onEditButtonClick}>Edit</Button>

      {isUpdated && (
        <Alert
          color="success"
          title="Successfully Updated"
          message={`Successfully updated ${patient.firstName} ${patient.lastName}`}
        />
      )}

      <PatientForm
        isEditable={isEditable}
        onFieldChange={onFieldChange}
        onSaveButtonClick={onSaveButtonClick}
        onCancelButtonClick={onCancelButtonClick}
        patient={patient}
      />
    </div>
  )
}

export default withRouter(ViewPatient)
