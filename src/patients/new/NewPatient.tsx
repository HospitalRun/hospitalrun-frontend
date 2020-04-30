import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Toast } from '@hospitalrun/components'
import GeneralInformation from '../GeneralInformation'
import useTitle from '../../page-header/useTitle'
import Patient from '../../model/Patient'
import { createPatient } from '../patient-slice'
import { getPatientName } from '../util/patient-name-util'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import { RootState } from '../../store'

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
  const [errorMessage, setErrorMessage] = useState('')
  const [invalidFields, setInvalidFields] = useState({
    givenName: false,
    dateOfBirth: false,
    suffix: false,
    prefix: false,
    familyName: false,
    preferredLanguage: false,
  })
  const [feedbackFields, setFeedbackFields] = useState({
    givenName: '',
    dateOfBirth: '',
    suffix: '',
    prefix: '',
    familyName: '',
    preferredLanguage: '',
  })

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

  const validateInput = () => {
    let inputIsValid = true
    const regexContainsNumber = /\d/

    setInvalidFields((prevState) => ({
      ...prevState,
      givenName: false,
      dateOfBirth: false,
      suffix: false,
      prefix: false,
      familyName: false,
      preferredLanguage: false,
    }))

    if (!patient.givenName) {
      inputIsValid = false
      setErrorMessage(t('patient.errors.createPatientError'))
      setInvalidFields((prevState) => ({
        ...prevState,
        givenName: true,
      }))
      setFeedbackFields((prevState) => ({
        ...prevState,
        givenName: t('patient.errors.patientGivenNameFeedback'),
      }))
    }
    if (patient.dateOfBirth) {
      if (parseISO(patient.dateOfBirth) > new Date(Date.now())) {
        inputIsValid = false
        setErrorMessage(t('patient.errors.createPatientError'))
        setInvalidFields((prevState) => ({
          ...prevState,
          dateOfBirth: true,
        }))
        setFeedbackFields((prevState) => ({
          ...prevState,
          dateOfBirth: t('patient.errors.patientDateOfBirthFeedback'),
        }))
      }
    }
    if (patient.suffix) {
      if (regexContainsNumber.test(patient.suffix)) {
        inputIsValid = false
        setErrorMessage(t('patient.errors.createPatientError'))
        setInvalidFields((prevState) => ({
          ...prevState,
          suffix: true,
        }))
        setFeedbackFields((prevState) => ({
          ...prevState,
          suffix: t('patient.errors.patientSuffixFeedback'),
        }))
      }
    }
    if (patient.prefix) {
      if (regexContainsNumber.test(patient.prefix)) {
        inputIsValid = false
        setErrorMessage(t('patient.errors.createPatientError'))
        setInvalidFields((prevState) => ({
          ...prevState,
          prefix: true,
        }))
        setFeedbackFields((prevState) => ({
          ...prevState,
          prefix: t('patient.errors.patientPrefixFeedback'),
        }))
      }
    }
    if (patient.familyName) {
      if (regexContainsNumber.test(patient.familyName)) {
        inputIsValid = false
        setErrorMessage(t('patient.errors.createPatientError'))
        setInvalidFields((prevState) => ({
          ...prevState,
          familyName: true,
        }))
        setFeedbackFields((prevState) => ({
          ...prevState,
          familyName: t('patient.errors.patientFamilyNameFeedback'),
        }))
      }
    }
    if (patient.givenName) {
      if (regexContainsNumber.test(patient.givenName)) {
        inputIsValid = false
        setErrorMessage(t('patient.errors.createPatientError'))
        setInvalidFields((prevState) => ({
          ...prevState,
          givenName: true,
        }))
        setFeedbackFields((prevState) => ({
          ...prevState,
          givenName: t('patient.errors.patientGivenNameContainNumFeedback'),
        }))
      }
    }
    if (patient.preferredLanguage) {
      if (regexContainsNumber.test(patient.preferredLanguage)) {
        inputIsValid = false
        setErrorMessage(t('patient.errors.createPatientError'))
        setInvalidFields((prevState) => ({
          ...prevState,
          preferredLanguage: true,
        }))
        setFeedbackFields((prevState) => ({
          ...prevState,
          preferredLanguage: t('patient.errors.patientPreferredLanguageFeedback'),
        }))
      }
    }

    return inputIsValid
  }

  const onSave = () => {
    if (validateInput()) {
      dispatch(
        createPatient(
          {
            ...patient,
            fullName: getPatientName(patient.givenName, patient.familyName, patient.suffix),
          },
          onSuccessfulSave,
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
