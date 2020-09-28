import { Calendar, Button } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../../page-header/title/useTitle'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import useAppointments from '../hooks/useAppointments'

interface Event {
  id: string
  start: Date
  end: Date
  title: string
  allDay: boolean
}

const breadcrumbs = [{ i18nKey: 'scheduling.appointments.label', location: '/appointments' }]

const ViewAppointments = () => {
  const { t } = useTranslator()
  const history = useHistory()
  useTitle(t('scheduling.appointments.label'))
  const appointments = useAppointments()
  const [events, setEvents] = useState<Event[]>([])
  const setButtonToolBar = useButtonToolbarSetter()
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    setButtonToolBar([
      <Button
        key="newAppointmentButton"
        outlined
        color="success"
        icon="appointment-add"
        onClick={() => history.push('/appointments/new')}
      >
        {t('scheduling.appointments.new')}
      </Button>,
    ])

    return () => {
      setButtonToolBar([])
    }
  }, [setButtonToolBar, history, t])

  useEffect(() => {
    // get appointments, find patients, then make Event objects out of the two and set events.
    const getAppointments = async () => {
      appointments.then(async (appointmentsList) => {
        if (appointmentsList) {
          const newEvents = await Promise.all(
            appointmentsList.map(async (appointment) => {
              const patient = await PatientRepository.find(appointment.patient)
              return {
                id: appointment.id,
                start: new Date(appointment.startDateTime),
                end: new Date(appointment.endDateTime),
                title: patient.fullName || '',
                allDay: false,
              }
            }),
          )
          setEvents(newEvents)
        }
      })
    }
    getAppointments()
  }, []) // provide an empty dependency array, to ensure this useEffect will only run on mount.

  return (
    <div>
      <Calendar
        events={events}
        onEventClick={(event) => {
          history.push(`/appointments/${event.id}`)
        }}
      />
    </div>
  )
}

export default ViewAppointments
