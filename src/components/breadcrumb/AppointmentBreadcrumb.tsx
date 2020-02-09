import React from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb as HrBreadcrumb,
  BreadcrumbItem as HrBreadcrumbItem,
} from '@hospitalrun/components'
import { RootState } from '../../store'

const AppointmentBreacrumb = () => {
  const { t } = useTranslation()
  const { appointment } = useSelector((state: RootState) => state.appointment)
  const history = useHistory()
  let appointmentLabel = ''

  if (appointment.startDateTime && appointment.endDateTime) {
    const startDateLabel = new Date(appointment.startDateTime).toLocaleString()
    const endDateLabel = new Date(appointment.endDateTime).toLocaleString()
    appointmentLabel = `${startDateLabel} - ${endDateLabel}`
  }

  return (
    <HrBreadcrumb>
      <HrBreadcrumbItem onClick={() => history.push('/appointments')}>
        {t('scheduling.appointments.label')}
      </HrBreadcrumbItem>
      <HrBreadcrumbItem active>{appointmentLabel}</HrBreadcrumbItem>
    </HrBreadcrumb>
  )
}

export default AppointmentBreacrumb
