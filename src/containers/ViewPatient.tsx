import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, useHistory, useParams } from 'react-router-dom'
import { Button, Alert, Spinner } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import useTitle from '../util/useTitle'
import { fetchPatient, updatePatient } from '../slices/patient-slice'
import { RootState } from '../store'
import Patient from '../model/Patient'
import PatientForm from '../components/PatientForm'

const ViewPatient = () => {
  const { t } = useTranslation()
  useTitle(t('patients.viewPatient'))
  const dispatch = useDispatch()
  const { patient, isLoading, isUpdatedSuccessfully } = useSelector(
    (state: RootState) => state.patient,
  )
  const [isEditable, setIsEditable] = useState(false)
  const [currentPatientDetails, setCurrentPatientDetails] = useState({
    firstName: '',
    lastName: '',
  })
  const history = useHistory()
  const { id } = useParams()

  const onSaveButtonClick = async () => {
    dispatch(
      updatePatient(
        new Patient(
          patient.id,
          patient.rev,
          currentPatientDetails.firstName,
          currentPatientDetails.lastName,
        ),
      ),
    )
    setIsEditable(false)
  }

  const onCancelButtonClick = () => {
    history.push(`/patients`)
  }

  const onEditButtonClick = () => {
    setIsEditable(true)
  }

  const onFieldChange = (key: string, value: string) => {
    setCurrentPatientDetails({
      ...currentPatientDetails,
      [key]: value,
    })
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div className="container">
      <Button onClick={onEditButtonClick}>{t('actions.edit')}</Button>
      {isUpdatedSuccessfully && (
        <Alert
          color="success"
          title="Successfully Updated"
          message={`Successfully updated ${patient.firstName} ${patient.lastName}`}
        />
      )}
      <br />
      {patient.id}
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
