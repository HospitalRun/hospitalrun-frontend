import { Select, Typeahead, Label, Alert } from '@hospitalrun/components'
import React from 'react'

import DateTimePickerWithLabelFormGroup from '../../shared/components/input/DateTimePickerWithLabelFormGroup'
import { SelectOption } from '../../shared/components/input/SelectOption'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Appointment from '../../shared/model/Appointment'
import Patient from '../../shared/model/Patient'

interface Props {
  appointment: Appointment
  patient?: Patient
  isEditable: boolean
  error?: any
  onFieldChange?: (key: string, value: string | boolean) => void
}

const AppointmentDetailForm = (props: Props) => {
  const { onFieldChange, appointment, patient, isEditable, error } = props
  const { t } = useTranslator()

  const onDateChange = (date: Date, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, date.toISOString())

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, event.target.value)

  const typeOptions: SelectOption[] = [
    { label: t('scheduling.appointment.types.checkup'), value: 'checkup' },
    { label: t('scheduling.appointment.types.emergency'), value: 'emergency' },
    { label: t('scheduling.appointment.types.followUp'), value: 'follow up' },
    { label: t('scheduling.appointment.types.routine'), value: 'routine' },
    { label: t('scheduling.appointment.types.walkIn'), value: 'walk in' },
  ]

  return (
    <>
      {error?.message && <Alert className="alert" color="danger" message={t(error?.message)} />}
      <div className="row">
        <div className="col">
          <div className="form-group">
            <Label
              htmlFor="patientTypeahead"
              isRequired
              text={t('scheduling.appointment.patient')}
            />
            <Typeahead
              id="patientTypeahead"
              disabled={!isEditable || patient !== undefined}
              value={patient?.fullName}
              placeholder={t('scheduling.appointment.patient')}
              onChange={(p: Patient[]) =>
                onFieldChange && p[0] && onFieldChange('patient', p[0].id)
              }
              onSearch={async (query: string) => PatientRepository.search(query)}
              searchAccessor="fullName"
              renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
              isInvalid={!!error?.patient}
              feedback={t(error?.patient)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="startDate"
            label={t('scheduling.appointment.startDate')}
            value={
              appointment.startDateTime && appointment.startDateTime.length > 0
                ? new Date(appointment.startDateTime)
                : undefined
            }
            isEditable={isEditable}
            isInvalid={error?.startDateTime}
            feedback={t(error?.startDateTime)}
            onChange={(date: Date) => {
              onDateChange(date, 'startDateTime')
            }}
          />
        </div>
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="endDate"
            label={t('scheduling.appointment.endDate')}
            value={
              appointment.endDateTime && appointment.endDateTime.length > 0
                ? new Date(appointment.endDateTime)
                : undefined
            }
            isEditable={isEditable}
            onChange={(date: Date) => {
              onDateChange(date, 'endDateTime')
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TextInputWithLabelFormGroup
            name="location"
            label={t('scheduling.appointment.location')}
            value={appointment.location}
            isEditable={isEditable}
            onChange={(event) => {
              onInputElementChange(event, 'location')
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group" data-testid="typeSelect">
            <Label text={t('scheduling.appointment.type')} title="type" />
            <Select
              id="type"
              options={typeOptions}
              defaultSelected={typeOptions.filter(({ value }) => value === appointment.type)}
              onChange={(values) => onFieldChange && onFieldChange('type', values[0])}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <TextFieldWithLabelFormGroup
              name="reason"
              label={t('scheduling.appointment.reason')}
              value={appointment.reason}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                onFieldChange && onFieldChange('reason', event.currentTarget.value)
              }
            />
          </div>
        </div>
      </div>
    </>
  )
}

AppointmentDetailForm.defaultProps = {
  isEditable: true,
}

export default AppointmentDetailForm
