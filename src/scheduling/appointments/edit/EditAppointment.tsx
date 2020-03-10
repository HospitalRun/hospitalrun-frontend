import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner, Button } from '@hospitalrun/components'
import { isBefore } from 'date-fns'

import AppointmentDetailForm from '../AppointmentDetailForm'
import useTitle from '../../../page-header/useTitle'
import Appointment from '../../../model/Appointment'
import { updateAppointment, fetchAppointment } from '../appointment-slice'
import { RootState } from '../../../store'
import { getAppointmentLabel } from '../util/scheduling-appointment.util'
import useAddBreadcrumbs from '../../../breadcrumbs/useAddBreadcrumbs'

const EditAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.editAppointment'))
  const history = useHistory()
  const dispatch = useDispatch()

  const [appointment, setAppointment] = useState({} as Appointment)
  const [errorMessage, setErrorMessage] = useState('')
  const { appointment: reduxAppointment, patient, isLoading } = useSelector(
    (state: RootState) => state.appointment,
  )
  const breadcrumbs = [
    { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
    {
      text: getAppointmentLabel(reduxAppointment),
      location: `/appointments/${reduxAppointment.id}`,
    },
    {
      i18nKey: 'scheduling.appointments.editAppointment',
      location: `/appointments/edit/${reduxAppointment.id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    setAppointment(reduxAppointment)
  }, [reduxAppointment])

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      dispatch(fetchAppointment(id))
    }
  }, [id, dispatch])

  const onCancel = () => {
    history.push(`/appointments/${appointment.id}`)
  }

  const onSaveSuccess = () => {
    history.push(`/appointments/${appointment.id}`)
  }

  const onSave = () => {
    let newErrorMessage = ''
    if (isBefore(new Date(appointment.endDateTime), new Date(appointment.startDateTime))) {
      newErrorMessage += ` ${t('scheduling.appointment.errors.startDateMustBeBeforeEndDate')}`
    }

    if (newErrorMessage) {
      setErrorMessage(newErrorMessage.trim())
      return
    }

    dispatch(updateAppointment(appointment as Appointment, onSaveSuccess))
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setAppointment({
      ...appointment,
      [key]: value,
    })
  }

  if (isLoading || !appointment.id || !patient.id) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <AppointmentDetailForm
        isEditable
        appointment={appointment}
        patient={patient}
        onFieldChange={onFieldChange}
        errorMessage={errorMessage}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg">
          <Button className="mr-2" color="success" onClick={onSave}>
            {t('actions.save')}
          </Button>
          <Button color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditAppointment
