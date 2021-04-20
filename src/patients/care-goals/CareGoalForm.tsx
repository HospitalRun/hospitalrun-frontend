import { Select, Label, Alert, Row, Column } from '@hospitalrun/components'
import React, { useState } from 'react'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import { Option } from '../../shared/components/input/SelectWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import CareGoal, { CareGoalStatus, CareGoalAchievementStatus } from '../../shared/model/CareGoal'

interface Error {
  message?: string
  description?: string
  status?: string
  achievementStatus?: string
  priority?: string
  startDate?: string
  dueDate?: string
  note?: string
}

interface Props {
  careGoal: Partial<CareGoal>
  careGoalError?: Error
  onChange?: (newCareGoal: Partial<CareGoal>) => void
  disabled: boolean
}

const CareGoalForm = (props: Props) => {
  const { careGoal, careGoalError, disabled, onChange } = props
  const { t } = useTranslator()

  const [priority, setPriority] = useState(careGoal.priority)
  const [status, setStatus] = useState(careGoal.status)
  const [achievementStatus, setAchievementStatus] = useState(careGoal.achievementStatus)

  const priorityOptions: Option[] = [
    { label: t('patient.careGoal.priority.low'), value: 'low' },
    { label: t('patient.careGoal.priority.medium'), value: 'medium' },
    { label: t('patient.careGoal.priority.high'), value: 'high' },
  ]

  const statusOptions: Option[] = Object.values(CareGoalStatus).map((v) => ({ label: v, value: v }))

  const achievementsStatusOptions: Option[] = Object.values(CareGoalAchievementStatus).map((v) => ({
    label: v,
    value: v,
  }))

  const onFieldChange = (
    name: string,
    value: string | CareGoalStatus | CareGoalAchievementStatus,
  ) => {
    if (onChange) {
      const newCareGoal = {
        ...careGoal,
        [name]: value,
      }
      onChange(newCareGoal)
    }
  }

  const onPriorityChange = (values: string[]) => {
    const value = values[0] as 'low' | 'medium' | 'high'

    onFieldChange('priority', value)
    setPriority(value)
  }

  return (
    <form aria-label="care-goal-form">
      {careGoalError?.message && <Alert color="danger" message={t(careGoalError.message)} />}
      <Row>
        <Column sm={12}>
          <TextFieldWithLabelFormGroup
            isRequired
            value={careGoal.description}
            label={t('patient.careGoal.description')}
            name="description"
            feedback={t(careGoalError?.description || '')}
            isInvalid={!!careGoalError?.description}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('description', event.currentTarget.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          <Label
          title="priority"
          text={t('patient.careGoal.priority.label')}
          isRequired
          />
          <Select
          id="priority"
          options={priorityOptions}
          onChange={onPriorityChange}
          defaultSelected={priorityOptions.filter(({ value }) => value === priority)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={6}>
          <Label
          title="status"
          text={t('patient.careGoal.status')}
          isRequired
          />
          <Select
          id="status"
          options={statusOptions}
          onChange={(values) => {
            onFieldChange('status', values[0])
            setStatus(values[0] as CareGoalStatus)
          }}
          defaultSelected={statusOptions.filter(({ value }) => value === status)}
          />
        </Column>
        <Column sm={6}>
          <Label
          title="achievementStatus"
          text={t('patient.careGoal.achievementStatus')}
          isRequired
          />
          <Select
          id="achievementStatus"
          options={achievementsStatusOptions}
          onChange={(values) => {
            onFieldChange('achievementStatus', values[0])
            setAchievementStatus(values[0] as CareGoalAchievementStatus)
          }}
          defaultSelected={achievementsStatusOptions.filter(
            ({ value }) => value === achievementStatus,
          )}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={6}>
          <DatePickerWithLabelFormGroup
            name="startDate"
            label={t('patient.careGoal.startDate')}
            isRequired
            value={careGoal.startDate ? new Date(careGoal.startDate) : new Date()}
            isEditable={!disabled}
            isInvalid={!!careGoalError?.startDate}
            feedback={t(careGoalError?.startDate) || ''}
            onChange={(date) => (date ? onFieldChange('startDate', date.toISOString()) : null)}
          />
        </Column>
        <Column sm={6}>
          <DatePickerWithLabelFormGroup
            name="dueDate"
            label={t('patient.careGoal.dueDate')}
            isRequired
            isEditable={!disabled}
            isInvalid={!!careGoalError?.dueDate}
            feedback={t(careGoalError?.dueDate) || ''}
            value={careGoal.dueDate ? new Date(careGoal.dueDate) : new Date()}
            onChange={(date) => (date ? onFieldChange('dueDate', date.toISOString()) : null)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          <TextFieldWithLabelFormGroup
            name="note"
            label={t('patient.careGoal.note')}
            value={careGoal.note}
            isEditable={!disabled}
            isInvalid={!!careGoalError?.note}
            feedback={t(careGoalError?.note) || ''}
            onChange={(event) => onFieldChange('note', event.currentTarget.value)}
          />
        </Column>
      </Row>
    </form>
  )
}

CareGoalForm.defaultProps = {
  disabled: false,
}

export default CareGoalForm
