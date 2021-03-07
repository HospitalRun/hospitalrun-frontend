import { Button, Spinner, Toast } from '@hospitalrun/components'
import addMinutes from 'date-fns/addMinutes'
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes'
import isEmpty from 'lodash/isEmpty'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import useAddBreadcrumbs from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../../page-header/title/TitleContext'
import useTranslator from '../../../shared/hooks/useTranslator'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import useScheduleAppointment from '../../hooks/useScheduleAppointment'
import AppointmentDetailForm from '../AppointmentDetailForm'
import { AppointmentError } from '../util/validate-appointment'

const breadcrumbs = [
  { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
  { i18nKey: 'scheduling.appointments.new', location: '/appointments/new' },
]

interface LocationProps {
  pathname: string
  state?: {
    patient: Patient
  }
}

const NewAppointment = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const location: LocationProps = useLocation()
  const patient = location.state?.patient
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('scheduling.appointments.new'))
  })
  useAddBreadcrumbs(breadcrumbs, true)

  const startDateTime = roundToNearestMinutes(new Date(), { nearestTo: 15 })
  const endDateTime = addMinutes(startDateTime, 60)
  const [saved, setSaved] = useState(false)
  const [newAppointmentMutateError, setError] = useState<AppointmentError>({} as AppointmentError)
  const [newAppointment, setAppointment] = useState({
    patient: patient || '',
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    location: '',
    reason: '',
    type: '',
  } as Appointment)

  const {
    mutate: newAppointmentMutate,
    isLoading: isLoadingNewAppointment,
    isError: isErrorNewAppointment,
    validator: validateNewAppointment,
  } = useScheduleAppointment()

  const onCancelClick = () => {
    history.push('/appointments')
  }

  const onSave = () => {
    setSaved(true)
    setError(validateNewAppointment(newAppointment))
  }

  useEffect(() => {
    // if save click and no error proceed, else give error message.
    if (saved) {
      if (isEmpty(newAppointmentMutateError) && !isErrorNewAppointment) {
        newAppointmentMutate(newAppointment).then((result) => {
          Toast('success', t('states.success'), t('scheduling.appointment.successfullyCreated'))
          history.push(`/appointments/${result?.id}`)
        })
      } else if (!isEmpty(newAppointmentMutateError)) {
        newAppointmentMutateError.message = 'scheduling.appointment.errors.createAppointmentError'
      }
    }
    setSaved(false)
  }, [
    saved,
    newAppointmentMutateError,
    isErrorNewAppointment,
    newAppointmentMutate,
    newAppointment,
    t,
    history,
  ])

  if (isLoadingNewAppointment) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setAppointment({
      ...newAppointment,
      [key]: value,
    })
  }

  return (
    <div>
      <form aria-label="new appointment form">
        <AppointmentDetailForm
          appointment={newAppointment as Appointment}
          patient={patient as Patient}
          error={newAppointmentMutateError}
          onFieldChange={onFieldChange}
        />
        <div className="row float-right">
          <div className="btn-group btn-group-lg mr-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('scheduling.appointments.createAppointment')}
            </Button>
            <Button color="danger" onClick={onCancelClick}>
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewAppointment
