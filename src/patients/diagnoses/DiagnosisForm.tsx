import { Select, Label, Alert, Row, Column } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Input from '../../shared/components/input'
import { SelectOption } from '../../shared/components/input/SelectOption'
import Diagnosis, { DiagnosisStatus } from '../../shared/model/Diagnosis'
import Patient from '../../shared/model/Patient'
import usePatientVisits from '../hooks/usePatientVisits'

interface Error {
  message?: string
  name?: string
  diagnosisDate?: string
  onsetDate?: string
  abatementDate?: string
  status?: string
  note?: string
}

interface Props {
  diagnosis: Partial<Diagnosis>
  diagnosisError?: Error
  onChange?: (newDiagnosis: Partial<Diagnosis>) => void
  disabled: boolean
  patient: Patient
}

const DiagnosisForm = (props: Props) => {
  const { t } = useTranslation()
  const { diagnosis, diagnosisError, disabled, onChange, patient } = props
  const [status, setStatus] = useState(diagnosis.status)
  const { data: visits } = usePatientVisits(patient?.id)

  const onFieldChange = (name: string, value: string | DiagnosisStatus) => {
    if (onChange) {
      const newDiagnosis = {
        ...diagnosis,
        [name]: value,
      }
      onChange(newDiagnosis)
    }
  }

  const patientVisits = visits?.map((v) => ({
    label: `${v.type} at ${format(new Date(v.startDateTime), 'yyyy-MM-dd, hh:mm a')}`,
    value: v.id,
  })) as SelectOption[]

  const defaultSelectedVisitOption = () => {
    if (patientVisits !== undefined) {
      return patientVisits.filter(({ value }) => value === diagnosis.visit)
    }
    return []
  }

  const statusOptions: SelectOption[] = Object.values(DiagnosisStatus).map((v) => ({
    label: v,
    value: v,
  }))

  return (
    <form aria-label="form">
      {diagnosisError && (
        <Alert
          color="danger"
          title={t('states.error')}
          message={t(diagnosisError?.message || '')}
        />
      )}

      <Row>
        <Column md={12}>
          <Input.TextInputWithLabelFormGroup
            isRequired
            value={diagnosis.name}
            label={t('patient.diagnoses.diagnosisName')}
            name="name"
            feedback={t(diagnosisError?.name || '')}
            isInvalid={!!diagnosisError?.name}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('name', event.currentTarget.value)}
          />
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <Input.DatePickerWithLabelFormGroup
            name="diagnosisDate"
            label={t('patient.diagnoses.diagnosisDate')}
            value={diagnosis.diagnosisDate ? new Date(diagnosis.diagnosisDate) : new Date()}
            isEditable={!disabled}
            onChange={(date) => onFieldChange('diagnosisDate', date.toISOString())}
            isRequired
            feedback={t(diagnosisError?.diagnosisDate || '')}
            isInvalid={!!diagnosisError?.diagnosisDate}
          />
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <Input.DatePickerWithLabelFormGroup
            name="onsetDate"
            label={t('patient.diagnoses.onsetDate')}
            value={diagnosis.onsetDate ? new Date(diagnosis.onsetDate) : new Date()}
            isEditable={!disabled}
            onChange={(date) => onFieldChange('onsetDate', date.toISOString())}
            isRequired
            feedback={t(diagnosisError?.onsetDate || '')}
            isInvalid={!!diagnosisError?.onsetDate}
          />
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <Input.DatePickerWithLabelFormGroup
            name="abatementDate"
            label={t('patient.diagnoses.abatementDate')}
            value={diagnosis.abatementDate ? new Date(diagnosis.abatementDate) : new Date()}
            isEditable={!disabled}
            isRequired
            onChange={(date) => onFieldChange('abatementDate', date.toISOString())}
            feedback={t(diagnosisError?.abatementDate || '')}
            isInvalid={!!diagnosisError?.abatementDate}
          />
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <div className="form-group" data-testid="visitSelect">
            <Label title="visit" text={t('patient.diagnoses.visit')} />
            <Select
              id="visitSelect"
              options={patientVisits || []}
              onChange={(values) => {
                onFieldChange('visit', values[0])
              }}
              defaultSelected={defaultSelectedVisitOption()}
              disabled={disabled}
            />
          </div>
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <div className="form-group" data-testid="statusSelect">
            <Label
              text={t('patient.diagnoses.status')}
              htmlFor="statusSelect"
              title="This is a required input"
              isRequired
            />
            <Select
              id="statusSelect"
              options={statusOptions || []}
              defaultSelected={statusOptions.filter(({ value }) => value === status)}
              onChange={(values) => {
                onFieldChange('status', values[0])
                setStatus(values[0] as DiagnosisStatus)
              }}
              disabled={disabled}
              isInvalid={!!diagnosisError?.status}
            />
          </div>
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <Input.TextFieldWithLabelFormGroup
            value={diagnosis.note}
            label={t('patient.diagnoses.note')}
            name="note"
            feedback={t(diagnosisError?.note || '')}
            isInvalid={!!diagnosisError?.note}
            isEditable={!disabled}
            onChange={(event) => onFieldChange('note', event.currentTarget.value)}
          />
        </Column>
      </Row>
    </form>
  )
}

DiagnosisForm.defaultProps = {
  disabled: false,
}
export default DiagnosisForm
