import React from 'react'
import { useTranslation } from 'react-i18next'
import useTitle from '../../page-header/useTitle'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'

const ReportIncident = () => {
  const { t } = useTranslation()
  useTitle(t('incidents.reports.new'))
  const breadcrumbs = [
    {
      i18nKey: 'incidents.reports.new',
      location: `/incidents/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return <h1>Report Incident</h1>
}

export default ReportIncident
