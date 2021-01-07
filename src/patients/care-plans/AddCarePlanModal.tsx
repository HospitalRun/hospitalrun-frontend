import { Modal } from '@hospitalrun/components'
import addMonths from 'date-fns/addMonths'
import React, { useState, useEffect } from 'react'

import useTranslator from '../../shared/hooks/useTranslator'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../shared/model/CarePlan'
import Patient from '../../shared/model/Patient'
import useAddCarePlan from '../hooks/useAddCarePlan'
import { CarePlanError } from '../util/validate-careplan'
import CarePlanForm from './CarePlanForm'

interface Props {
  patient: Patient
  show: boolean
  onCloseButtonClick: () => void
}

const initialCarePlanState = {
  title: '',
  description: '',
  startDate: new Date().toISOString(),
  endDate: addMonths(new Date(), 1).toISOString(),
  note: '',
  diagnosisId: '',
  status: CarePlanStatus.Active,
  intent: CarePlanIntent.Plan,
}

const AddCarePlanModal = (props: Props) => {
  const { show, onCloseButtonClick, patient } = props
  const { t } = useTranslator()
  const [mutate] = useAddCarePlan()
  const [carePlan, setCarePlan] = useState(initialCarePlanState)
  const [carePlanError, setCarePlanError] = useState<CarePlanError | undefined>(undefined)

  useEffect(() => {
    setCarePlan(initialCarePlanState)
  }, [show])

  const onCarePlanChange = (newCarePlan: Partial<CarePlan>) => {
    setCarePlan(newCarePlan as CarePlan)
  }

  const onClose = () => {
    onCloseButtonClick()
  }

  const onSaveButtonClick = async () => {
    try {
      await mutate({ patientId: patient.id, carePlan })
      onClose()
    } catch (e) {
      setCarePlanError(e)
    }
  }

  const body = (
    <CarePlanForm
      patient={patient}
      carePlan={carePlan}
      carePlanError={carePlanError}
      onChange={onCarePlanChange}
    />
  )
  return (
    <Modal
      show={show}
      toggle={onClose}
      title={t('patient.carePlan.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onClose,
      }}
      successButton={{
        children: t('patient.carePlan.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddCarePlanModal
