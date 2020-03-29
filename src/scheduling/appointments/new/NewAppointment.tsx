import React, { useState } from 'react'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import Appointment from 'model/Appointment'
import addMinutes from 'date-fns/addMinutes'
import { Button, Toast } from '@hospitalrun/components'
import errorMessageHandler from '../util/schedule-error-handling.util'
import useAddBreadcrumbs from '../../../breadcrumbs/useAddBreadcrumbs'
import { createAppointment } from '../appointment-slice'
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
  useAddBreadcrumbs(breadcrumbs, true)
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
  const [errorMessageState, setErrorMessageState] = useState({})
  const [patient, setPatient] = useState<any>()

  const onCancelClick = () => {
    history.push('/appointments')
  }

  const onNewAppointmentSaveSuccess = (newAppointment: Appointment) => {
    history.push(`/appointments/${newAppointment.id}`)
    Toast(
      'success',
      t('states.success'),
      `${t('scheduling.appointment.successfullyCreated')} ${newAppointment.id}`,
    )
  }

  const onNewAppointmentSaveError = () => {
    Toast('error', t('Error!'), `${t('scheduling.appointment.errorCreatingAppointment')}`)
  }

  const onSave = () => {
    const errors = errorMessageHandler(appointment as Appointment)
    const errorKeys = Object.keys(errors)

    if (errorKeys.length) {
      errorKeys.forEach((err) => {
        errors[err] = t(errors[err])
      })
      setErrorMessageState(errors)

      return
    }

    dispatch(
      createAppointment(
        appointment as Appointment,
        onNewAppointmentSaveSuccess,
        onNewAppointmentSaveError,
      ),
    )
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setErrorMessageState({})
    if (key === 'patientFullName') {
      setPatient(value)
    } else {
      setAppointment({
        ...appointment,
        [key]: value,
      })
    }
  }

  return (
    <div>
      <form>
        <AppointmentDetailForm
          appointment={appointment as Appointment}
          patient={patient}
          errorMessage="errorMessage"
          errorMessageState={errorMessageState}
          onFieldChange={onFieldChange}
          setErrorMessageState={setErrorMessageState}
        />
        <div className="row float-right">
          <div className="btn-group btn-group-lg">
            <Button className="mr-2" color="success" onClick={onSave}>
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
