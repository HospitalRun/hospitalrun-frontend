import React from 'react'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'

const NewAppointment = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.new'))

  return <h1>{t('scheduling.appointments.new')}</h1>
}

export default NewAppointment
