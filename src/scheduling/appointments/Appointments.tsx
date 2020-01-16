import React from 'react'
import { Calendar } from '@hospitalrun/components'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'

const Appointments = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.label'))
  return <Calendar />
}

export default Appointments
