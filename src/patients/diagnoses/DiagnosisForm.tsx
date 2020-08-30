import { Alert, Row, Column } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import DatePickerWithLabelFormGroup from '../../shared/components/input/DatePickerWithLabelFormGroup'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import Diagnosis, { DiagnosisStatus } from '../../shared/model/Diagnosis'
import Patient from '../../shared/model/Patient'

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

  const onFieldChange = (name: string, value: string | DiagnosisStatus) => {
    if (onChange) {
      const newDiagnosis = {
        ...diagnosis,
        [name]: value,
      }
      onChange(newDiagnosis)
    }
  }

  const patientVisits = patient?.visits?.map((v) => ({
    label: `${v.type} at ${format(new Date(v.startDateTime), 'yyyy-MM-dd, hh:mm a')}`,
    value: v.id,
  })) as Option[]

  const defaultSelectedVisitOption = () => {
    if (patientVisits !== undefined) {
      return patientVisits.filter(({ value }) => value === diagnosis.visit)
    }
    return []
  }

  const statusOptions: Option[] = Object.values(DiagnosisStatus).map((v) => ({
    label: v,
    value: v,
  }))

  return (
    <form>
      {diagnosisError && (
        <Alert
          color="danger"
          title={t('states.error')}
          message={t(diagnosisError?.message || '')}
        />
      )}

      <Row>
        <Column md={12}>
          <TextInputWithLabelFormGroup
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
          <DatePickerWithLabelFormGroup
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
          <DatePickerWithLabelFormGroup
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
          <DatePickerWithLabelFormGroup
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
          <SelectWithLabelFormGroup
            name="visit"
            label={t('patient.diagnoses.visit')}
            isRequired={false}
            options={patientVisits || []}
            defaultSelected={defaultSelectedVisitOption()}
            onChange={(values) => {
              onFieldChange('visit', values[0])
            }}
            isEditable={patient?.visits !== undefined}
          />
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <SelectWithLabelFormGroup
            name="status"
            label={t('patient.diagnoses.status')}
            isRequired
            options={statusOptions}
            defaultSelected={statusOptions.filter(({ value }) => value === status)}
            onChange={(values) => {
              onFieldChange('status', values[0])
              setStatus(values[0] as DiagnosisStatus)
            }}
            isEditable={!disabled}
            isInvalid={!!diagnosisError?.status}
          />
        </Column>
      </Row>

      <Row>
        <Column md={12}>
          <TextFieldWithLabelFormGroup
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
