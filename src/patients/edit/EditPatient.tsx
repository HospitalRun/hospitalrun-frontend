import { Spinner, Button, Toast } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import GeneralInformation from '../GeneralInformation'
import usePatient from '../hooks/usePatient'
import { updatePatient } from '../patient-slice'
import { getPatientCode, getPatientFullName } from '../util/patient-util'

const EditPatient = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const dispatch = useDispatch()
  const { id } = useParams()

  const { data: givenPatient, status } = usePatient(id)
  const [patient, setPatient] = useState({} as Patient)

  const { updateError } = useSelector((state: RootState) => state.patient)

  const updateTitle = useUpdateTitle()

  useEffect(() => {
    updateTitle(
      `${t('patients.editPatient')}: ${getPatientFullName(givenPatient)} (${getPatientCode(
        givenPatient,
      )})`,
    )
  })

  const breadcrumbs = [
    { i18nKey: 'patients.label', location: '/patients' },
    { text: getPatientFullName(givenPatient), location: `/patients/${id}` },
    { i18nKey: 'patients.editPatient', location: `/patients/${id}/edit` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    setPatient(givenPatient || ({} as Patient))
  }, [givenPatient])

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
    await dispatch(updatePatient(patient, onSuccessfulSave))
  }

  const onPatientChange = (newPatient: Partial<Patient>) => {
    setPatient(newPatient as Patient)
  }

  if (status === 'loading') {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <GeneralInformation
        patient={patient}
        isEditable
        onChange={onPatientChange}
        error={updateError}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg mt-3 mr-3">
          <Button className="btn-save mr-2" color="success" onClick={onSave}>
            {t('patients.updatePatient')}
          </Button>
          <Button className="btn-cancel" color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditPatient
