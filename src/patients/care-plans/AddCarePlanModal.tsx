import { Modal } from '@hospitalrun/components'
import { addMonths } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import CarePlan from '../../model/CarePlan'
import { RootState } from '../../store'
import { addCarePlan } from '../patient-slice'
import CarePlanForm from './CarePlanForm'

interface Props {
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
}

const AddCarePlanModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { carePlanError, patient } = useSelector((state: RootState) => state.patient)
  const [carePlan, setCarePlan] = useState(initialCarePlanState)

  useEffect(() => {
    setCarePlan(initialCarePlanState)
  }, [show])

  const onCarePlanChange = (newCarePlan: Partial<CarePlan>) => {
    setCarePlan(newCarePlan as CarePlan)
  }

  const onSaveButtonClick = () => {
    dispatch(addCarePlan(patient.id, carePlan as CarePlan))
  }

  const onClose = () => {
    onCloseButtonClick()
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
