import { Button, Toast } from '@hospitalrun/components'
import addMinutes from 'date-fns/addMinutes'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../../page-header/title/useTitle'
import useTranslator from '../../../shared/hooks/useTranslator'
import Appointment from '../../../shared/model/Appointment'
import { RootState } from '../../../shared/store'
import { createAppointment } from '../appointment-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'

const breadcrumbs = [
  { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
  { i18nKey: 'scheduling.appointments.new', location: '/appointments/new' },
]

const NewAppointment = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('scheduling.appointments.new'))
  useAddBreadcrumbs(breadcrumbs, true)
  const startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
  const endDateTime = addMinutes(startDateTime, 60)
  const { error } = useSelector((state: RootState) => state.appointment)

  const [appointment, setAppointment] = useState({
    patient: '',
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    location: '',
    reason: '',
    type: '',
  })

  const onCancelClick = () => {
    history.push('/appointments')
  }

  const onSaveSuccess = (newAppointment: Appointment) => {
    history.push(`/appointments/${newAppointment.id}`)
    Toast('success', t('states.success'), `${t('scheduling.appointment.successfullyCreated')}`)
  }

  const onSave = () => {
    dispatch(createAppointment(appointment as Appointment, onSaveSuccess))
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setAppointment({
      ...appointment,
      [key]: value,
    })
  }

  return (
    <div>
      <form>
        <AppointmentDetailForm
          appointment={appointment as Appointment}
          error={error}
          onFieldChange={onFieldChange}
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
