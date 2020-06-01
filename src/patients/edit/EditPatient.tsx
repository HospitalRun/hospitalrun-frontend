import { Spinner, Button, Toast } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

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

  const onSave = async () => {
    await dispatch(
      updatePatient(
        {
          ...patient,
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

  const onTempObjectArrayChange = (
    key: number,
    value: string,
    arrayObject: string | boolean,
    type: string | boolean,
    objects: any[],
  ) => {
    if (arrayObject === 'phoneNumbers') {
      let temporaryObject = { ...objects[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, phoneNumber: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      const temporaryObjects = [...objects]
      temporaryObjects[key] = temporaryObject
      setPatient({
        ...patient,
        [arrayObject]: [...temporaryObjects],
      })
    } else if (arrayObject === 'emails') {
      let temporaryObject = { ...objects[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, email: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      const temporaryObjects = [...objects]
      temporaryObjects[key] = temporaryObject
      setPatient({
        ...patient,
        [arrayObject]: [...temporaryObjects],
      })
    } else if (arrayObject === 'addresses') {
      let temporaryObject = { ...objects[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, address: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      const temporaryObjects = [...objects]
      temporaryObjects[key] = temporaryObject
      setPatient({
        ...patient,
        [arrayObject]: [...temporaryObjects],
      })
    }
  }

  const onObjectArrayChange = (
    key: number,
    value: string,
    arrayObject: string | boolean,
    type: string | boolean,
  ) => {
    if (arrayObject === 'phoneNumbers') {
      let temporaryObject = { ...patient.phoneNumbers[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, phoneNumber: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      const temporaryObjects = [...patient.phoneNumbers]
      temporaryObjects[key] = temporaryObject
      setPatient({
        ...patient,
        [arrayObject]: [...temporaryObjects],
      })
    } else if (arrayObject === 'emails') {
      let temporaryObject = { ...patient.emails[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, email: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      const temporaryObjects = [...patient.emails]
      temporaryObjects[key] = temporaryObject
      setPatient({
        ...patient,
        [arrayObject]: [...temporaryObjects],
      })
      console.log(JSON.stringify(patient.emails))
    } else if (arrayObject === 'addresses') {
      let temporaryObject = { ...patient.addresses[key] }
      if (typeof arrayObject === 'string' && typeof type === 'boolean') {
        temporaryObject = { ...temporaryObject, address: value }
      } else {
        temporaryObject = { ...temporaryObject, type: value }
      }
      const temporaryObjects = [...patient.addresses]
      temporaryObjects[key] = temporaryObject
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
        onTempObjectArrayChange={onTempObjectArrayChange}
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
