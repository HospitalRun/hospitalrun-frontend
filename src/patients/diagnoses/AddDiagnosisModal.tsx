import { Modal } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useTranslator from '../../shared/hooks/useTranslator'
import Diagnosis from '../../shared/model/Diagnosis'
import { RootState } from '../../shared/store'
import { addDiagnosis } from '../patient-slice'
import DiagnosisForm from './DiagnosisForm'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const initialDiagnosisState = {
  name: '',
  diagnosisDate: new Date().toISOString(),
  onsetDate: new Date().toISOString(),
  abatementDate: new Date().toISOString(),
  note: '',
}

const AddDiagnosisModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { diagnosisError, patient } = useSelector((state: RootState) => state.patient)
  const { t } = useTranslator()

  const [diagnosis, setDiagnosis] = useState(initialDiagnosisState)

  useEffect(() => {
    setDiagnosis(initialDiagnosisState)
  }, [show])

  const onDiagnosisChange = (newDiagnosis: Partial<Diagnosis>) => {
    setDiagnosis(newDiagnosis as Diagnosis)
  }
  const onSaveButtonClick = () => {
    dispatch(addDiagnosis(patient.id, diagnosis as Diagnosis))
  }

  const body = (
    <DiagnosisForm
      diagnosis={diagnosis}
      diagnosisError={diagnosisError}
      onChange={onDiagnosisChange}
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
