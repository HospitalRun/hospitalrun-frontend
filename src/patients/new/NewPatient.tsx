import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Button } from '@hospitalrun/components'

import GeneralInformation from '../GeneralInformation'
import useTitle from '../../page-header/useTitle'
import Patient from '../../model/Patient'
import { createPatient } from '../patient-slice'
import { getPatientName } from '../util/patient-name-util'

const NewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()

  const [patient, setPatient] = useState({} as Patient)
  const [errorMessage, setErrorMessage] = useState('')

  useTitle(t('patients.newPatient'))

  const onCancel = () => {
    history.push('/patients')
  }

  const onSave = () => {
    if (!patient.givenName) {
      setErrorMessage(t('patient.errors.patientGivenNameRequired'))
    } else {
      dispatch(
        createPatient(
          {
            ...patient,
            fullName: getPatientName(patient.givenName, patient.familyName, patient.suffix),
          },
          history,
        ),
      )
    }
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setPatient({
      ...patient,
      [key]: value,
    })
  }

  return (
    <div>
      <GeneralInformation
        isEditable
        patient={patient}
        onFieldChange={onFieldChange}
        errorMessage={errorMessage}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg">
          <Button className="mr-2" color="success" onClick={onSave}>
            {t('actions.save')}
          </Button>
          <Button color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewPatient
