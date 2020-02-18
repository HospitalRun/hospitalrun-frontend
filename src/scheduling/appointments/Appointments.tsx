import React, { useEffect, useState } from 'react'
import { Calendar, Button } from '@hospitalrun/components'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useHistory } from 'react-router'
import PatientRepository from 'clients/db/PatientRepository'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
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
  const setButtonToolBar = useButtonToolbarSetter()
  setButtonToolBar([
    <Button
      outlined
      color="success"
      icon="appointment-add"
      onClick={() => history.push('/appointments/new')}
    >
      {t('scheduling.appointments.new')}
    </Button>,
  ])

  useEffect(() => {
    dispatch(fetchAppointments())

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar])

  useEffect(() => {
    const getAppointments = async () => {
      const newEvents = await Promise.all(
        appointments.map(async (a) => {
          const patient = await PatientRepository.find(a.patientId)
          return {
            id: a.id,
            start: new Date(a.startDateTime),
            end: new Date(a.endDateTime),
            title: patient.fullName || '',
            allDay: false,
          }
        }),
      )

      setEvents(newEvents)
    }

    if (appointments) {
      getAppointments()
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
