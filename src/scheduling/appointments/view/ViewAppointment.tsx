import React, { useEffect } from 'react'
import useTitle from 'page-header/useTitle'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useParams, useHistory } from 'react-router'
import { Spinner, Button } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import { fetchAppointment } from '../appointment-slice'
import AppointmentDetailForm from '../AppointmentDetailForm'

const ViewAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.viewAppointment'))
  const dispatch = useDispatch()
  const { id } = useParams()
  const history = useHistory()
  const { appointment, patient, isLoading } = useSelector((state: RootState) => state.appointment)

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
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          <Button
            color="success"
            outlined
            icon="edit"
            onClick={() => {
              history.push(`/appointments/edit/${appointment.id}`)
            }}
          >
            {t('actions.edit')}
          </Button>
        </div>
      </div>
      <AppointmentDetailForm appointment={appointment} isEditable={false} patient={patient} />
    </div>
  )
}

export default ViewAppointment
