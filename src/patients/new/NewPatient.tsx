import React from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import NewPatientForm from './NewPatientForm'
import useTitle from '../../util/useTitle'
import Patient from '../../model/Patient'

const NewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('patients.newPatient'))

  const onCancel = () => {
    history.push('/patients')
  }

  const onSave = (patient: Patient) => {
    console.log(patient)
  }

  return <NewPatientForm onCancel={onCancel} onSave={onSave} />
}

export default NewPatient
