import { Modal } from '@hospitalrun/components'
import addMonths from 'date-fns/addMonths'
import React, { useState, useEffect } from 'react'

import useTranslator from '../../shared/hooks/useTranslator'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../shared/model/CareGoal'
import Patient from '../../shared/model/Patient'
import useAddCareGoal from '../hooks/useAddCareGoal'
import { CareGoalError } from '../util/validate-caregoal'
import CareGoalForm from './CareGoalForm'

interface Props {
  patient: Patient
  show: boolean
  onCloseButtonClick: () => void
}

const initialCareGoalState = {
  description: '',
  startDate: new Date().toISOString(),
  dueDate: addMonths(new Date(), 1).toISOString(),
  note: '',
  priority: 'medium',
  status: CareGoalStatus.Accepted,
  achievementStatus: CareGoalAchievementStatus.InProgress,
} as CareGoal

const AddCareGoalModal = (props: Props) => {
  const { t } = useTranslator()
  const { patient, show, onCloseButtonClick } = props
  const [mutate] = useAddCareGoal()
  const [careGoal, setCareGoal] = useState(initialCareGoalState)
  const [careGoalError, setCareGoalError] = useState<CareGoalError | undefined>(undefined)

  useEffect(() => {
    setCareGoal(initialCareGoalState)
  }, [show])

  const onClose = () => {
    onCloseButtonClick()
  }

  const onCareGoalChange = (newCareGoal: Partial<CareGoal>) => {
    setCareGoal(newCareGoal as CareGoal)
  }

  const onSaveButtonClick = async () => {
    try {
      await mutate({ patientId: patient.id, careGoal })
      onClose()
    } catch (e) {
      setCareGoalError(e)
    }
  }

  const body = (
    <CareGoalForm careGoal={careGoal} careGoalError={careGoalError} onChange={onCareGoalChange} />
  )

  return (
    <Modal
      show={show}
      toggle={onClose}
      title={t('patient.careGoal.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onClose,
      }}
      successButton={{
        children: t('patient.careGoal.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddCareGoalModal
