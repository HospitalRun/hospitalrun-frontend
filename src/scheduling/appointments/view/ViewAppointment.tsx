import React, { useEffect } from 'react'
import useTitle from 'page-header/useTitle'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useParams } from 'react-router'
import { Spinner } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import Appointment from 'model/Appointment'
import { fetchAppointment } from '../appointment-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'
import useAddBreadcrumbs from '../../../breadcrumbs/useAddBreadcrumbs'

function getAppointmentLabel(appointment: Appointment) {
  const { id, startDateTime, endDateTime } = appointment

  return startDateTime && endDateTime
    ? `${new Date(startDateTime).toLocaleString()} - ${new Date(endDateTime).toLocaleString()}`
    : id
}

const ViewAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.view'))
  const dispatch = useDispatch()
  const { id } = useParams()
  const { appointment, patient, isLoading } = useSelector((state: RootState) => state.appointment)

  const breadcrumbs = [
    { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
    { text: getAppointmentLabel(appointment), location: `/patients/${appointment.id}` },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointment(id))
    }
  }, [dispatch, id])

  if (!appointment.id || isLoading) {
    return <Spinner type="BarLoader" loading />
  }

  return (
    <div>
      <AppointmentDetailForm
        appointment={appointment}
        isEditable={false}
        patient={patient}
        onAppointmentChange={() => {
          // not editable
        }}
      />
    </div>
  )
}

export default ViewAppointment
