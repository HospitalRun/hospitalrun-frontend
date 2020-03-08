import React, { useState, useEffect } from 'react'
import { Modal, Alert } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import Diagnosis from 'model/Diagnosis'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import DatePickerWithLabelFormGroup from 'components/input/DatePickerWithLabelFormGroup'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
  onSave: (diagnosis: Diagnosis) => void
}

const AddDiagnosisModal = (props: Props) => {
  const { show, onCloseButtonClick, onSave } = props
  const [diagnosis, setDiagnosis] = useState({ name: '', diagnosisDate: new Date().toISOString() })
  const [errorMessage, setErrorMessage] = useState('')

  const { t } = useTranslation()

  useEffect(() => {
    setErrorMessage('')
    setDiagnosis({ name: '', diagnosisDate: new Date().toISOString() })
  }, [show])

  const onSaveButtonClick = () => {
    let newErrorMessage = ''
    if (!diagnosis.name) {
      newErrorMessage += t('patient.diagnoses.error.nameRequired')
    }
    setErrorMessage(newErrorMessage)

    if (!newErrorMessage) {
      onSave(diagnosis as Diagnosis)
    }
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
        {errorMessage && <Alert color="danger" title={t('states.error')} message={errorMessage} />}
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
