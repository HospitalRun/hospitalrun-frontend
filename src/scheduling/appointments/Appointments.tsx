import React from 'react'
import { Calendar } from '@hospitalrun/components'
import useTitle from 'page-header/useTitle'
import useButton from 'page-header/useButton'

import { useTranslation } from 'react-i18next'

const Appointments = () => {
  const { t } = useTranslation()
  useTitle(t('scheduling.appointments.label'))
  useButton('', '', false, 'add')
  return <Calendar />
}

export default Appointments
