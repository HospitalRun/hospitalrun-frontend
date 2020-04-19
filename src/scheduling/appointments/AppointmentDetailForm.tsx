import React from 'react'
import Appointment from 'model/Appointment'
import DateTimePickerWithLabelFormGroup from 'components/input/DateTimePickerWithLabelFormGroup'
import { Label, Typeahead } from '@hospitalrun/components'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import SelectWithLabelFormGroup from 'components/input/SelectWithLableFormGroup'
import { useTranslation } from 'react-i18next'

interface Props {
  appointment: Appointment
  patient?: Patient
  isEditable: boolean
  errorMessage?: string
  errorMessageState?: { [key: string]: string }
  onFieldChange?: (key: string, value: string | boolean) => void
  setErrorMessageState?: (arg0: { [key: string]: string | undefined }) => void
}

const AppointmentDetailForm = (props: Props) => {
  const {
    onFieldChange,
    appointment,
    patient,
    isEditable,
    errorMessageState,
    setErrorMessageState,
  } = props
  const { t } = useTranslation()

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, event.target.value)

  const onDateChange = (date: Date, fieldName: string) => {
    if (setErrorMessageState && date === null) {
      setErrorMessageState({
        ...errorMessageState,
        [fieldName]: t(`scheduling.appointment.errors.${fieldName}Required`),
      })
      return
    }
    if (onFieldChange) {
      onFieldChange(fieldName, date.toISOString())
    }
  }

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, event.target.value)

  const onTypeaheadChange = (p: Patient[]) => {
    const { id, fullName } = p[0] && p[0]
    if (onFieldChange) {
      onFieldChange('patientId', id)
      onFieldChange('patientFullName', fullName as string)
    }
  }

  return (
    <>
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
              onChange={(p: Patient[]) => onTypeaheadChange(p)}
              onSearch={async (query: string) => PatientRepository.search(query)}
              searchAccessor="fullName"
              renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
            />
            {errorMessageState?.patient && (
              <span className="small text-danger">{errorMessageState?.patient}</span>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="startDate"
            label={t('scheduling.appointment.startDate')}
            value={new Date(appointment.startDateTime)}
            isEditable={isEditable}
            onChange={(date: Date) => {
              onDateChange(date, 'startDateTime')
            }}
            feedback={errorMessageState?.startDateTime}
          />
        </div>
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="endDate"
            label={t('scheduling.appointment.endDate')}
            value={new Date(appointment.endDateTime)}
            isEditable={isEditable}
            onChange={(date: Date) => {
              onDateChange(date, 'endDateTime')
            }}
            feedback={errorMessageState?.endDateTime}
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
          <SelectWithLabelFormGroup
            name="type"
            label={t('scheduling.appointment.type')}
            value={appointment.type}
            isEditable={isEditable}
            options={[
              { label: t('scheduling.appointment.types.checkup'), value: 'checkup' },
              { label: t('scheduling.appointment.types.emergency'), value: 'emergency' },
              { label: t('scheduling.appointment.types.followUp'), value: 'follow up' },
              { label: t('scheduling.appointment.types.routine'), value: 'routine' },
              { label: t('scheduling.appointment.types.walkIn'), value: 'walk in' },
            ]}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              onSelectChange(event, 'type')
            }}
          />
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
              onChange={
                (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange && onFieldChange('reason', event.currentTarget.value)
                // eslint-disable-next-line react/jsx-curly-newline
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
