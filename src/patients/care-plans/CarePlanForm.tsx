import { Column, Row } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'

import DatePickerWithLabelFormGroup from '../../components/input/DatePickerWithLabelFormGroup'
import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../model/CarePlan'
import Patient from '../../model/Patient'

interface Error {
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
  onChange: (newCarePlan: Partial<CarePlan>) => void
  disabled: boolean
}

const CarePlanForm = (props: Props) => {
  const { t } = useTranslation()
  const { patient, carePlan, carePlanError, disabled, onChange } = props

  const onFieldChange = (name: string, value: string | CarePlanStatus | CarePlanIntent) => {
    const newCarePlan = {
      ...carePlan,
      [name]: value,
    }
    onChange(newCarePlan)
  }

  return (
    <form>
      <Row>
        <Column sm={12}>
          <TextInputWithLabelFormGroup
            isRequired
            value={carePlan.title}
            label={t('patient.carePlan.title')}
            name="title"
            feedback={carePlanError?.title}
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
            feedback={carePlanError?.description}
            isInvalid={!!carePlanError?.description}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('description', event.currentTarget.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          <SelectWithLabelFormGroup
            isRequired
            value={carePlan.diagnosisId}
            label={t('patient.carePlan.condition')}
            name="condition"
            feedback={carePlanError?.condition}
            isInvalid={!!carePlanError?.condition}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('diagnosisId', event.currentTarget.value)}
            options={patient.diagnoses?.map((d) => ({ label: d.name, value: d.id })) || []}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={6}>
          <SelectWithLabelFormGroup
            isRequired
            value={carePlan.status}
            label={t('patient.carePlan.status')}
            name="status"
            feedback={carePlanError?.status}
            isInvalid={!!carePlanError?.status}
            isEditable={!disabled}
            options={Object.values(CarePlanStatus).map((v) => ({ label: v, value: v }))}
            onChange={(event) => onFieldChange('status', event.currentTarget.value)}
          />
        </Column>
        <Column sm={6}>
          <SelectWithLabelFormGroup
            isRequired
            value={carePlan.intent}
            label={t('patient.carePlan.intent')}
            name="intent"
            feedback={carePlanError?.intent}
            isInvalid={!!carePlanError?.intent}
            isEditable={!disabled}
            options={Object.values(CarePlanIntent).map((v) => ({ label: v, value: v }))}
            onChange={(event) => onFieldChange('intent', event.currentTarget.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={6}>
          <DatePickerWithLabelFormGroup
            isRequired
            value={carePlan.startDate ? new Date(carePlan.startDate) : new Date()}
            label={t('patient.carePlan.startDate')}
            name="startDate"
            feedback={carePlanError?.startDate}
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
            feedback={carePlanError?.endDate}
            isInvalid={!!carePlanError?.endDate}
            isEditable={!disabled}
            onChange={(date) => onFieldChange('endDate', date.toISOString())}
          />
        </Column>
      </Row>
      <Row>
        <Column sm={12}>
          <TextFieldWithLabelFormGroup
            isRequired
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
