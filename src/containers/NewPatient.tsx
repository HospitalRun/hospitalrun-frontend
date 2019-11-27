import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { createPatient } from 'slices/patients-slice'
import Patient from 'model/Patient'
import PatientForm from 'components/PatientForm'
import useTitle from 'util/useTitle'
import { useTranslation } from 'react-i18next'

const NewPatient = () => {
  const { t } = useTranslation()
  useTitle(t('patients.newPatient'))
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
