import { Modal } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'

import useTranslator from '../../shared/hooks/useTranslator'
import Diagnosis, { DiagnosisStatus } from '../../shared/model/Diagnosis'
import Patient from '../../shared/model/Patient'
import useAddPatientDiagnosis from '../hooks/useAddPatientDiagnosis'
import { DiagnosisError } from '../util/validate-diagnosis'
import DiagnosisForm from './DiagnosisForm'

interface NewDiagnosisModalProps {
  patient: Patient
  show: boolean
  onCloseButtonClick: () => void
}

const initialDiagnosisState = {
  name: '',
  diagnosisDate: new Date().toISOString(),
  onsetDate: new Date().toISOString(),
  abatementDate: new Date().toISOString(),
  note: '',
  visit: '',
  status: DiagnosisStatus.Active,
}

const AddDiagnosisModal = (props: NewDiagnosisModalProps) => {
  const { show, onCloseButtonClick, patient } = props
  const { t } = useTranslator()
  const [mutate] = useAddPatientDiagnosis()

  const [diagnosis, setDiagnosis] = useState(initialDiagnosisState)
  const [diagnosisError, setDiagnosisError] = useState<DiagnosisError | undefined>(undefined)
  useEffect(() => {
    setDiagnosis(initialDiagnosisState)
  }, [show])

  const onDiagnosisChange = (newDiagnosis: Partial<Diagnosis>) => {
    setDiagnosis(newDiagnosis as Diagnosis)
  }
  const onSaveButtonClick = async () => {
    try {
      await mutate({ diagnosis, patientId: patient.id })
      onCloseButtonClick()
    } catch (e) {
      setDiagnosisError(e)
    }
  }

  const body = (
    <DiagnosisForm
      diagnosis={diagnosis}
      diagnosisError={diagnosisError}
      onChange={onDiagnosisChange}
      patient={patient}
    />
  )
  return (
    <Modal
      show={show}
      toggle={onCloseButtonClick}
      title={t('patient.diagnoses.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: t('patient.diagnoses.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddDiagnosisModal
