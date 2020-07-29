import { Modal, Alert } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Diagnosis from '../../shared/model/Diagnosis'
import { RootState } from '../../shared/store'
import { addDiagnosis } from '../patient-slice'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const AddDiagnosisModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { diagnosisError, patient } = useSelector((state: RootState) => state.patient)
  const { t } = useTranslator()

  const [diagnosis, setDiagnosis] = useState({ name: '', diagnosisDate: new Date().toISOString() })

  useEffect(() => {
    setDiagnosis({ name: '', diagnosisDate: new Date().toISOString() })
  }, [show])

  const onSaveButtonClick = () => {
    dispatch(addDiagnosis(patient.id, diagnosis as Diagnosis))
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setDiagnosis((prevDiagnosis) => ({ ...prevDiagnosis, name }))
  }

  const onDiagnosisDateChange = (diagnosisDate: Date) => {
    if (diagnosisDate) {
      setDiagnosis((prevDiagnosis) => ({
        ...prevDiagnosis,
        diagnosisDate: diagnosisDate.toISOString(),
      }))
    }
  }

  const body = (
    <>
      <form>
        {diagnosisError && (
          <Alert
            color="danger"
            title={t('states.error')}
            message={t(diagnosisError?.message || '')}
          />
        )}
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="name"
                label={t('patient.diagnoses.diagnosisName')}
                isEditable
                placeholder={t('patient.diagnoses.diagnosisName')}
                value={diagnosis.name}
                onChange={onNameChange}
                isRequired
                feedback={t(diagnosisError?.name || '')}
                isInvalid={!!diagnosisError?.name}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <DatePickerWithLabelFormGroup
              name="diagnosisDate"
              label={t('patient.diagnoses.diagnosisDate')}
              value={new Date(diagnosis.diagnosisDate)}
              isEditable
              onChange={onDiagnosisDateChange}
              isRequired
              feedback={t(diagnosisError?.date || '')}
              isInvalid={!!diagnosisError?.date}
            />
          </div>
        </div>
      </form>
    </>
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
