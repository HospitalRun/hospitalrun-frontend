import { Spinner, Button, Toast } from '@hospitalrun/components'
import isEmpty from 'lodash/isEmpty'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../../page-header/title/TitleContext'
import usePatient from '../../../patients/hooks/usePatient'
import useTranslator from '../../../shared/hooks/useTranslator'
import Appointment from '../../../shared/model/Appointment'
import useAppointment from '../../hooks/useAppointment'
import useUpdateAppointment from '../../hooks/useUpdateAppointment'
import AppointmentDetailForm from '../AppointmentDetailForm'
import { getAppointmentLabel } from '../util/scheduling-appointment.util'

const EditAppointment = () => {
  const { t } = useTranslator()
  const { id } = useParams()

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('scheduling.appointments.editAppointment'))
  }, [updateTitle, t])
  const history = useHistory()

  const [newAppointment, setAppointment] = useState({} as Appointment)
  const { data: currentAppointment, isLoading: isLoadingAppointment } = useAppointment(id)

  const {
    mutate: updateMutate,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: updateMutateError,
  } = useUpdateAppointment(newAppointment)
  const { data: patient } = usePatient(currentAppointment ? currentAppointment.patient : id)

  const breadcrumbs = [
    { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
    {
      text: getAppointmentLabel(currentAppointment),
      location: `/appointments/${id}`,
    },
    {
      i18nKey: 'scheduling.appointments.editAppointment',
      location: `/appointments/edit/${id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    if (currentAppointment !== undefined) {
      setAppointment(currentAppointment)
    }
  }, [currentAppointment])

  const onCancel = () => {
    history.push(`/appointments/${newAppointment.id}`)
  }

  const onSave = () => {
    if (isEmpty(updateMutateError) && !isErrorUpdate) {
      updateMutate(newAppointment).then(() => {
        Toast('success', t('states.success'), t('scheduling.appointment.successfullyUpdated'))
        history.push(`/appointments/${newAppointment.id}`)
      })
    }
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setAppointment({
      ...newAppointment,
      [key]: value,
    })
  }

  if (isLoadingAppointment || isLoadingUpdate) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <AppointmentDetailForm
        isEditable
        appointment={newAppointment}
        patient={patient}
        onFieldChange={onFieldChange}
        error={updateMutateError}
      />
      <div className="row float-right">
        <div className="btn-group btn-group-lg mr-3">
          <Button className="mr-2" color="success" onClick={onSave}>
            {t('scheduling.appointments.updateAppointment')}
          </Button>
          <Button color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditAppointment
