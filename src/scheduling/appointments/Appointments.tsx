import React, { useEffect, useState } from 'react'
import { Calendar } from '@hospitalrun/components'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useHistory } from 'react-router'
import { fetchAppointments } from './appointments-slice'

interface Event {
  id: string
  start: Date
  end: Date
  title: string
  allDay: boolean
}

const Appointments = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('scheduling.appointments.label'))
  const dispatch = useDispatch()
  const { appointments } = useSelector((state: RootState) => state.appointments)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  useEffect(() => {
    if (appointments) {
      const newEvents: Event[] = []
      appointments.forEach((a) => {
        const event = {
          id: a.id,
          start: new Date(a.startDateTime),
          end: new Date(a.endDateTime),
          title: a.patientId,
          allDay: false,
        }

        newEvents.push(event)
      })

      setEvents(newEvents)
    }
  }, [appointments])

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

export default Appointments
