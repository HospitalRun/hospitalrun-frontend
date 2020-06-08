import { Button, Toast } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { generate } from 'shortid'

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

  const cleanUpPatient = () => {
    const patientCopy = { ...patient }

    if ('phoneNumbers' in patientCopy) {
      patientCopy.phoneNumbers = patientCopy.phoneNumbers.filter(
        (phoneNumber) => phoneNumber.phoneNumber.trim() !== '',
      )
    }

    if ('emails' in patientCopy) {
      patientCopy.emails = patientCopy.emails.filter((email) => email.email.trim() !== '')
    }

    if ('addresses' in patientCopy) {
      patientCopy.addresses = patientCopy.addresses.filter(
        (address) => address.address.trim() !== '',
      )
    }

    setPatient(patientCopy)
    return patientCopy
  }

  const onSave = () => {
    const patientCopy = cleanUpPatient()

    dispatch(
      createPatient(
        {
          ...patientCopy,
          fullName: getPatientName(patient.givenName, patient.familyName, patient.suffix),
        },
        onSuccessfulSave,
      ),
    )
  }

  const onObjectArrayChange = (
    key: number,
    value: string,
    arrayObject: string | boolean,
    type: string | boolean,
  ) => {
    let temporaryObjects = [{}]
    if (arrayObject === 'phoneNumbers') {
      let temporaryObject = { ...patient.phoneNumbers[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, phoneNumber: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      temporaryObjects = [...patient.phoneNumbers]
      temporaryObjects[key] = temporaryObject
    } else if (arrayObject === 'emails') {
      let temporaryObject = { ...patient.emails[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, email: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      temporaryObjects = [...patient.emails]
      temporaryObjects[key] = temporaryObject
    } else if (arrayObject === 'addresses') {
      let temporaryObject = { ...patient.addresses[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, address: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      temporaryObjects = [...patient.addresses]
      temporaryObjects[key] = temporaryObject
    }
    if (typeof arrayObject === 'string') {
      setPatient({
        ...patient,
        [arrayObject]: [...temporaryObjects],
      })
    }
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setPatient({
      ...patient,
      [key]: value,
    })
  }

  const addEmptyEntryToPatientArrayField = (key: string) => {
    let arrayOfObjects = []
    if (key === 'phoneNumbers') {
      const emptyPhoneNumber = {
        id: generate(),
        phoneNumber: '',
        type: '',
      }
      arrayOfObjects =
        key in patient ? [...patient.phoneNumbers, emptyPhoneNumber] : [emptyPhoneNumber]
    } else if (key === 'emails') {
      const emptyEmail = {
        id: generate(),
        email: '',
        type: '',
      }
      arrayOfObjects = key in patient ? [...patient.emails, emptyEmail] : [emptyEmail]
    } else {
      const emptyAddress = {
        id: generate(),
        addresses: '',
        type: '',
      }
      arrayOfObjects = key in patient ? [...patient.addresses, emptyAddress] : [emptyAddress]
    }
    setPatient({
      ...patient,
      [key]: arrayOfObjects,
    })
  }

  return (
    <div>
      <GeneralInformation
        isEditable
        patient={patient}
        onFieldChange={onFieldChange}
        onObjectArrayChange={onObjectArrayChange}
        addEmptyEntryToPatientArrayField={addEmptyEntryToPatientArrayField}
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
