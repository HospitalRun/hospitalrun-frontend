import React, { useState } from 'react'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import Appointment from 'model/Appointment'
import addMinutes from 'date-fns/addMinutes'
import { isBefore } from 'date-fns'
import { Button, Alert } from '@hospitalrun/components'
import useAddBreadcrumbs from '../../../breadcrumbs/useAddBreadcrumbs'
import { createAppointment } from '../appointments-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'

const breadcrumbs = [
  { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
  { i18nKey: 'scheduling.appointments.new', location: '/appointments/new' },
]

const NewAppointment = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('scheduling.appointments.new'))
  useAddBreadcrumbs(breadcrumbs)
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
        <AppointmentDetailForm
          appointment={appointment as Appointment}
          onAppointmentChange={setAppointment}
        />

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
