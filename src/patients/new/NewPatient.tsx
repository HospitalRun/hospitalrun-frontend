import { Button, Toast } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import Patient from '../../model/Patient'
import useTitle from '../../page-header/useTitle'
import { RootState } from '../../store'
import GeneralInformation from '../GeneralInformation'
import { createPatient } from '../patient-slice'
import { getPatientName } from '../util/patient-name-util'

const breadcrumbs = [
  { i18nKey: 'patients.label', location: '/patients' },
  { i18nKey: 'patients.newPatient', location: '/patients/new' },
]

const NewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { createError } = useSelector((state: RootState) => state.patient)

  const [patient, setPatient] = useState({} as Patient)

  useTitle(t('patients.newPatient'))
  useAddBreadcrumbs(breadcrumbs, true)

  const onCancel = () => {
    history.push('/patients')
  }

  const onSuccessfulSave = (newPatient: Patient) => {
    history.push(`/patients/${newPatient.id}`)
    Toast(
      'success',
      t('states.success'),
      `${t('patients.successfullyCreated')} ${newPatient.fullName}`,
    )
  }

  const onSave = () => {
    const { givenName, familyName, suffix, phoneNumbers, emails, addresses } = patient

    const newPatient = {
      ...patient,
      fullName: getPatientName(givenName, familyName, suffix),
      phoneNumbers: phoneNumbers.filter((p) => p.value.trim() !== ''),
      emails: emails.filter((e) => e.value.trim() !== ''),
      addresses: addresses.filter((a) => a.value.trim() !== ''),
    }

    dispatch(createPatient(newPatient, onSuccessfulSave))
  }

  const onPatientChange = (newPatient: Partial<Patient>) => {
    setPatient(newPatient as Patient)
  }

  return (
    <div>
      <GeneralInformation
        patient={patient}
        isEditable
        onChange={onPatientChange}
        error={createError}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg mt-3">
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
