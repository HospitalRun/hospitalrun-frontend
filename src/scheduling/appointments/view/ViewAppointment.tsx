import React, { useEffect } from 'react'
import useTitle from 'page-header/useTitle'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { fetchAppointment } from '../appointment-slice'
import { useParams } from 'react-router'
import AppointmentDetailForm from '../AppointmentDetailForm'
import { Spinner } from '@hospitalrun/components'

const ViewAppointment = () => {
  useTitle('View Appointment')
  const dispatch = useDispatch()
  const { id } = useParams()
  const { appointment, isLoading } = useSelector((state: RootState) => state.appointment)

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointment(id))
    }
  }, [dispatch])

  if (!appointment.id || isLoading) {
    return <Spinner type="BarLoader" loading />
  }

  return (
    <div>
      <AppointmentDetailForm appointment={appointment} onAppointmentChange={() => {}} />
    </div>
  )
}

export default ViewAppointment
