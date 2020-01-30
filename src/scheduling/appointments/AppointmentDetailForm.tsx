import React from 'react'
import Appointment from 'model/Appointment'
import DateTimePickerWithLabelFormGroup from 'components/input/DateTimePickerWithLabelFormGroup'
import { Typeahead, Label } from '@hospitalrun/components'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import SelectWithLabelFormGroup from 'components/input/SelectWithLableFormGroup'
import { useTranslation } from 'react-i18next'
interface Props {
  appointment: Appointment
  onAppointmentChange: (appointment: Appointment) => void
}

const AppointmentDetailForm = (props: Props) => {
  const { onAppointmentChange, appointment } = props
  const { t } = useTranslation()
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <Label htmlFor="patientTypeahead" text={t('scheduling.appointment.patient')} />
            <Typeahead
              id="patientTypeahead"
              placeholder={t('scheduling.appointment.patient')}
              onChange={(patient: Patient[]) => {
                onAppointmentChange({ ...appointment, patientId: patient[0].id })
              }}
              onSearch={async (query: string) => PatientRepository.search(query)}
              searchAccessor="fullName"
              renderMenuItemChildren={(patient: Patient) => (
                <div>{`${patient.fullName} (${patient.friendlyId})`}</div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="startDate"
            label={t('scheduling.appointment.startDate')}
            value={new Date(appointment.startDateTime)}
            isEditable
            onChange={(date) => {
              onAppointmentChange({ ...appointment, startDateTime: date.toISOString() })
            }}
          />
        </div>
        <div className="col">
          <DateTimePickerWithLabelFormGroup
            name="endDate"
            label={t('scheduling.appointment.endDate')}
            value={new Date(appointment.endDateTime)}
            isEditable
            onChange={(date) => {
              onAppointmentChange({ ...appointment, endDateTime: date.toISOString() })
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
            isEditable
            onChange={(event) => {
              onAppointmentChange({ ...appointment, location: event?.target.value })
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
            options={[
              { label: t('scheduling.appointment.types.checkup'), value: 'checkup' },
              { label: t('scheduling.appointment.types.emergency'), value: 'emergency' },
              { label: t('scheduling.appointment.types.followUp'), value: 'follow up' },
              { label: t('scheduling.appointment.types.routine'), value: 'routine' },
              { label: t('scheduling.appointment.types.walkUp'), value: 'walk up' },
            ]}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              onAppointmentChange({ ...appointment, type: event.currentTarget.value })
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
              isEditable
              onChange={(event) => {
                onAppointmentChange({ ...appointment, reason: event?.target.value })
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AppointmentDetailForm
