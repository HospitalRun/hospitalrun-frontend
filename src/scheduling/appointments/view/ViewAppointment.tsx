import React, { useEffect, useState } from 'react'
import useTitle from 'page-header/useTitle'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useParams, useHistory } from 'react-router'
import { Spinner, Button, Modal } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import Permissions from 'model/Permissions'
import { fetchAppointment, deleteAppointment } from '../appointment-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'

const ViewAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.view'))
  const dispatch = useDispatch()
  const { id } = useParams()
  const history = useHistory()
  const { appointment, patient, isLoading } = useSelector((state: RootState) => state.appointment)
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)

  const setButtons = useButtonToolbarSetter()

  const onAppointmentDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowDeleteConfirmation(true)
  }

  const onDeleteConfirmationButtonClick = () => {
    dispatch(deleteAppointment(appointment, history))
    setShowDeleteConfirmation(false)
  }

  const buttons = []
  if (permissions.includes(Permissions.DeleteAppointment)) {
    buttons.push(
      <Button
        key="deleteAppointmentButton"
        color="danger"
        icon="appointment-remove"
        onClick={onAppointmentDeleteButtonClick}
      >
        {t('scheduling.appointment.delete')}
      </Button>,
    )
  }

  setButtons(buttons)

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointment(id))
    }
    return () => setButtons([])
  }, [dispatch, id, setButtons])

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
      <Modal
        body={t('scheduling.appointment.deleteConfirmationMessage')}
        buttonsAlignment="right"
        show={showDeleteConfirmation}
        closeButton={{
          children: t('actions.delete'),
          color: 'danger',
          onClick: onDeleteConfirmationButtonClick,
        }}
        title={t('actions.confirmDelete')}
        toggle={() => setShowDeleteConfirmation(false)}
      />
    </div>
  )
}

export default ViewAppointment
