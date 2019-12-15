import '../../__mocks__/matchMediaMock'
import React from 'react'
import { useTranslation } from 'react-i18next'
import NewPatientForm from './NewPatientForm'
import useTitle from '../../util/useTitle'

const NewPatient = () => {
  const { t } = useTranslation()
  useTitle(t('patients.newPatient'))
  return <NewPatientForm />
}

export default NewPatient
