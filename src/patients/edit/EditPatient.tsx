import { Spinner, Button, Toast } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { generate } from 'shortid'

import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import Patient from '../../model/Patient'
import useTitle from '../../page-header/useTitle'
import { RootState } from '../../store'
import GeneralInformation from '../GeneralInformation'
import { updatePatient, fetchPatient } from '../patient-slice'
import { getPatientFullName, getPatientName } from '../util/patient-name-util'

const getPatientCode = (p: Patient): string => {
  if (p) {
    return p.code
  }

  return ''
}

const EditPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()

  const [patient, setPatient] = useState({} as Patient)

  const { patient: reduxPatient, status, updateError } = useSelector(
    (state: RootState) => state.patient,
  )

  useTitle(
    `${t('patients.editPatient')}: ${getPatientFullName(reduxPatient)} (${getPatientCode(
      reduxPatient,
    )})`,
  )

  const breadcrumbs = [
    { i18nKey: 'patients.label', location: '/patients' },
    { text: getPatientFullName(reduxPatient), location: `/patients/${reduxPatient.id}` },
    { i18nKey: 'patients.editPatient', location: `/patients/${reduxPatient.id}/edit` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    setPatient(reduxPatient)
  }, [reduxPatient])

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }
  }, [id, dispatch])

  const onCancel = () => {
    history.push(`/patients/${patient.id}`)
  }

  const onSuccessfulSave = (updatedPatient: Patient) => {
    history.push(`/patients/${updatedPatient.id}`)
    Toast(
      'success',
      t('states.success'),
      `${t('patients.successfullyUpdated')} ${patient.fullName}`,
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

  const onSave = async () => {
    const patientCopy = cleanUpPatient()

    await dispatch(
      updatePatient(
        {
          ...patientCopy,
          fullName: getPatientName(patient.givenName, patient.familyName, patient.suffix),
        },
        onSuccessfulSave,
      ),
    )
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

  if (status === 'loading') {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <GeneralInformation
        isEditable
        patient={patient}
        onFieldChange={onFieldChange}
        onObjectArrayChange={onObjectArrayChange}
        addEmptyEntryToPatientArrayField={addEmptyEntryToPatientArrayField}
        error={updateError}
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

export default EditPatient
