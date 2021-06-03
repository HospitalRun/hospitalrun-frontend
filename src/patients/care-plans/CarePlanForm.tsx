import { Select, Label, Alert, Column, Row } from '@hospitalrun/components'
import React, { useState } from 'react'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import { SelectOption } from '../../shared/components/input/SelectOption'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../shared/model/CarePlan'
import Patient from '../../shared/model/Patient'

interface Error {
  message?: string
  title?: string
  description?: string
  status?: string
  intent?: string
  startDate?: string
  endDate?: string
  note?: string
  condition?: string
}
interface Props {
  patient: Patient
  carePlan: Partial<CarePlan>
  carePlanError?: Error
  onChange?: (newCarePlan: Partial<CarePlan>) => void
  disabled: boolean
}

const CarePlanForm = (props: Props) => {
  const { t } = useTranslator()
  const { patient, carePlan, carePlanError, disabled, onChange } = props

  const [condition, setCondition] = useState(carePlan.diagnosisId)
  const [status, setStatus] = useState(carePlan.status)
  const [intent, setIntent] = useState(carePlan.intent)

  const onFieldChange = (name: string, value: string | CarePlanStatus | CarePlanIntent) => {
    if (onChange) {
      const newCarePlan = {
        ...carePlan,
        [name]: value,
      }
      onChange(newCarePlan)
    }
  }

  const conditionOptions: SelectOption[] =
    patient.diagnoses?.map((d) => ({ label: d.name, value: d.id })) || []

  const statusOptions: SelectOption[] = Object.values(CarePlanStatus).map((v) => ({
    label: v,
    value: v,
  }))

  const intentOptions: SelectOption[] = Object.values(CarePlanIntent).map((v) => ({
    label: v,
    value: v,
  }))

  return (
    <form aria-label="form">
      {carePlanError?.message && <Alert color="danger" message={t(carePlanError.message)} />}
      <Row>
        <Column sm={12}>
          <TextInputWithLabelFormGroup
            isRequired
            value={carePlan.title}
            label={t('patient.carePlan.title')}
            name="title"
            feedback={t(carePlanError?.title || '')}
            isInvalid={!!carePlanError?.title}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('title', event.currentTarget.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          <TextFieldWithLabelFormGroup
            isRequired
            value={carePlan.description}
            label={t('patient.carePlan.description')}
            name="description"
            feedback={t(carePlanError?.description || '')}
            isInvalid={!!carePlanError?.description}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('description', event.currentTarget.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          {/* add feedback in next round */}
          <div className="form-group" data-testid="conditionSelect">
            <Label
              text={t('patient.carePlan.condition')}
              htmlFor="conditionSelect"
              title="This is a required input"
              isRequired
            />
            <Select
              id="conditionSelect"
              options={conditionOptions}
              defaultSelected={conditionOptions.filter(({ value }) => value === condition)}
              onChange={(values) => {
                onFieldChange('diagnosisId', values[0])
                setCondition(values[0])
              }}
              disabled={disabled}
              isInvalid={!!carePlanError?.condition}
            />
          </div>
        </Column>
      </Row>
      <Row>
        <Column sm={6}>
          <div className="form-group" data-testid="statusSelect">
            <Label
              text={t('patient.carePlan.status')}
              htmlFor="statusSelect"
              title="This is a required input"
              isRequired
            />
            <Select
              id="statusSelect"
              options={statusOptions}
              defaultSelected={statusOptions.filter(({ value }) => value === status)}
              onChange={(values) => {
                onFieldChange('status', values[0])
                setStatus(values[0] as CarePlanStatus)
              }}
              disabled={disabled}
              isInvalid={!!carePlanError?.status}
            />
          </div>
        </Column>
        <Column sm={6}>
          <div className="form-group" data-testid="intentSelect">
            <Label
              text={t('patient.carePlan.intent')}
              htmlFor="intentSelect"
              title="This is a required input"
              isRequired
            />
            <Select
              id="intentSelect"
              options={intentOptions}
              defaultSelected={intentOptions.filter(({ value }) => value === intent)}
              onChange={(values) => {
                onFieldChange('intent', values[0])
                setIntent(values[0] as CarePlanIntent)
              }}
              disabled={disabled}
              isInvalid={!!carePlanError?.intent}
            />
          </div>
        </Column>
      </Row>
      <Row>
        <Column sm={6}>
          <DatePickerWithLabelFormGroup
            isRequired
            value={carePlan.startDate ? new Date(carePlan.startDate) : new Date()}
            label={t('patient.carePlan.startDate')}
            name="startDate"
            feedback={t(carePlanError?.startDate || '')}
            isInvalid={!!carePlanError?.startDate}
            isEditable={!disabled}
            onChange={(date) => onFieldChange('startDate', date.toISOString())}
          />
        </Column>
        <Column sm={6}>
          <DatePickerWithLabelFormGroup
            isRequired
            value={carePlan.endDate ? new Date(carePlan.endDate) : new Date()}
            label={t('patient.carePlan.endDate')}
            name="endDate"
            feedback={t(carePlanError?.endDate || '')}
            isInvalid={!!carePlanError?.endDate}
            isEditable={!disabled}
            onChange={(date) => onFieldChange('endDate', date.toISOString())}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          <TextFieldWithLabelFormGroup
            value={carePlan.note}
            label={t('patient.carePlan.note')}
            name="note"
            feedback={carePlanError?.note}
            isInvalid={!!carePlanError?.note}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('note', event.currentTarget.value)}
          />
        </Column>
      </Row>
    </form>
  )
}

CarePlanForm.defaultProps = {
  disabled: false,
}

export default CarePlanForm
