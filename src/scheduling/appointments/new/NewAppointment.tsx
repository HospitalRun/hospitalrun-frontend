import React, { useState } from 'react'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import DateTimePickerWithLabelFormGroup from 'components/input/DateTimePickerWithLabelFormGroup'
import { Typeahead, Label, Button, Alert } from '@hospitalrun/components'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import SelectWithLabelFormGroup from 'components/input/SelectWithLableFormGroup'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import Appointment from 'model/Appointment'
import addMinutes from 'date-fns/addMinutes'
import { isBefore } from 'date-fns'
import { createAppointment } from '../appointments-slice'

const NewAppointment = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('scheduling.appointments.new'))
  const startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
  const endDateTime = addMinutes(startDateTime, 60)

  const [appointment, setAppointment] = useState({
    patientId: '',
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    location: '',
    reason: '',
    type: '',
  })
  const [errorMessage, setErrorMessage] = useState('')

  const onCancelClick = () => {
    history.push('/appointments')
  }

  const onSaveClick = () => {
    let newErrorMessage = ''
    if (!appointment.patientId) {
      newErrorMessage += t('scheduling.appointment.errors.patientRequired')
    }
    if (isBefore(new Date(appointment.endDateTime), new Date(appointment.startDateTime))) {
      newErrorMessage += ` ${t('scheduling.appointment.errors.startDateMustBeBeforeEndDate')}`
    }

    if (newErrorMessage) {
      setErrorMessage(newErrorMessage.trim())
      return
    }

    dispatch(createAppointment(appointment as Appointment, history))
  }

  return (
    <div>
      <form>
        {errorMessage && (
          <Alert
            color="danger"
            title={t('scheduling.appointment.errors.errorCreatingAppointment')}
            message={errorMessage}
          />
        )}
        <div className="row">
          <div className="col">
            <div className="form-group">
              <Label htmlFor="patientTypeahead" text={t('scheduling.appointment.patient')} />
              <Typeahead
                id="patientTypeahead"
                placeholder={t('scheduling.appointment.patient')}
                onChange={(patient: Patient[]) => {
                  setAppointment({ ...appointment, patientId: patient[0].id })
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
                setAppointment({ ...appointment, startDateTime: date.toISOString() })
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
                setAppointment({ ...appointment, endDateTime: date.toISOString() })
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
                setAppointment({ ...appointment, location: event?.target.value })
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
                setAppointment({ ...appointment, type: event.currentTarget.value })
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
                  setAppointment({ ...appointment, reason: event?.target.value })
                }}
              />
            </div>
          </div>
        </div>
        <div className="row float-right">
          <div className="btn-group btn-group-lg">
            <Button className="mr-2" color="success" onClick={onSaveClick}>
              {t('actions.save')}
            </Button>
            <Button color="danger" onClick={onCancelClick}>
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewAppointment
