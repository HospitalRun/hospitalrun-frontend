import React, { useEffect } from 'react'
import useTitle from 'page-header/useTitle'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useParams } from 'react-router'
import { Spinner } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import { fetchAppointment } from '../appointment-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'

const ViewAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.view'))
  const dispatch = useDispatch()
  const { id } = useParams()
  const { appointment, isLoading } = useSelector((state: RootState) => state.appointment)

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
        onAppointmentChange={() => {
          // not editable
        }}
      />
    </div>
  )
}

export default ViewAppointment
