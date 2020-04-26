import React from 'react'
import { useTranslation } from 'react-i18next'
import useTitle from '../../page-header/useTitle'

const ViewIncidents = () => {
  const { t } = useTranslation()
  useTitle(t('incidents.reports.label'))

  return <h1>Reported Incidents</h1>
}

export default ViewIncidents
