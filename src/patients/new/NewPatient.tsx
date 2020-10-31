import { Button, Toast } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import GeneralInformation from '../GeneralInformation'
import useCreatePatient from '../hooks/useCreatePatient'
import { isPossibleDuplicatePatient } from '../util/is-possible-duplicate-patient'
import DuplicateNewPatientModal from './DuplicateNewPatientModal'

const breadcrumbs = [
  { i18nKey: 'patients.label', location: '/patients' },
  { i18nKey: 'patients.newPatient', location: '/patients/new' },
]

const NewPatient = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const { patients } = Object(useSelector((state: RootState) => state.patients))

  const [patient, setPatient] = useState({} as Patient)
  const [duplicatePatient, setDuplicatePatient] = useState<Patient | undefined>(undefined)
  const [showDuplicateNewPatientModal, setShowDuplicateNewPatientModal] = useState<boolean>(false)

  const [createPatient, { error: createError }] = useCreatePatient()

  const testPatient = {
    givenName: 'Kelly',
    familyName: 'Clark',
    sex: 'female',
    dateOfBirth: '1963-01-09T05:00:00.000Z',
  } as Patient

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('patients.newPatient'))
  })
  useAddBreadcrumbs(breadcrumbs, true)

  const onCancel = () => {
    history.push('/patients')
  }

  const savePatient = async () => {
    const data = await createPatient(patient)

    if (!data) {
      return
    }

    history.push(`/patients/${data.id}`)

    Toast('success', t('states.success'), `${t('patients.successfullyCreated')} ${data.fullName}`)
  }

  const onSave = async () => {
    let duplicatePatients = []
    if (patients !== undefined) {
      duplicatePatients = patients.filter((existingPatient: any) =>
        isPossibleDuplicatePatient(patient, existingPatient),
      )
    }

    if (duplicatePatients.length > 0) {
      setShowDuplicateNewPatientModal(true)
      setDuplicatePatient(duplicatePatients as Patient)
    } else {
      savePatient()
    }

    const testCase = [isPossibleDuplicatePatient(patient, testPatient)]
    if (testCase.length > 0) {
      return true
    }
    return false
  }

  const onPatientChange = (newPatient: Partial<Patient>) => {
    setPatient(newPatient as Patient)
  }

  const createDuplicateNewPatient = () => {
    savePatient()
  }

  const closeDuplicateNewPatientModal = () => {
    setShowDuplicateNewPatientModal(false)
  }

  return (
    <div>
      <GeneralInformation
        patient={patient}
        isEditable
        onChange={onPatientChange}
        error={createError ?? undefined}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg mt-3">
          <Button className="btn-save mr-2" color="success" onClick={onSave}>
            {t('actions.save')}
          </Button>
          <Button className="btn-cancel" color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>

      <DuplicateNewPatientModal
        duplicatePatient={duplicatePatient}
        show={showDuplicateNewPatientModal}
        toggle={closeDuplicateNewPatientModal}
        onContinueButtonClick={createDuplicateNewPatient}
        onCloseButtonClick={closeDuplicateNewPatientModal}
      />
    </div>
  )
}

export default NewPatient
