import React, { useEffect } from 'react'
import useTitle from 'page-header/useTitle'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useParams, useHistory } from 'react-router'
import { Spinner, Button } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import { fetchAppointment } from '../appointment-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'

const ViewAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.viewAppointment'))
  const dispatch = useDispatch()
  const { id } = useParams()
  const history = useHistory()
  const { appointment, patient, isLoading } = useSelector((state: RootState) => state.appointment)

  const setButtonToolBar = useButtonToolbarSetter()
  console.log('setButtonToolBar was: ')
  console.log(setButtonToolBar)
  setButtonToolBar([
    <Button
      key="editAppointmentButton"
      color="success"
      icon="edit"
      outlined
      onClick={() => {
        history.push(`/appointments/edit/${appointment.id}`)
      }}
    >
      {t('actions.edit')}
    </Button>,
  ])

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointment(id))
    }

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, id, setButtonToolBar])

  if (!appointment.id || isLoading) {
    return <Spinner type="BarLoader" loading />
  }

  return <AppointmentDetailForm appointment={appointment} isEditable={false} patient={patient} />
}

export default ViewAppointment
