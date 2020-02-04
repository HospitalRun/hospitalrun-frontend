import React from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import NewPatientForm from './NewPatientForm'
import useTitle from '../../page-header/useTitle'
import Patient from '../../model/Patient'
import { createPatient } from '../patients-slice'

const NewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('patients.newPatient'))

  const onCancel = () => {
    history.push('/patients')
  }

  const onSave = (patient: Patient) => {
    dispatch(createPatient(patient, history))
  }

  return <NewPatientForm onCancel={onCancel} onSave={onSave} />
}

export default NewPatient
