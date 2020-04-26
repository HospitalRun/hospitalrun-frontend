import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/useTitle'

const ViewIncident = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  useTitle(t('incidents.reports.view'))
  const breadcrumbs = [
    {
      i18nKey: 'incidents.reports.view',
      location: `/incidents/${id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return <h1>View Incident</h1>
}

export default ViewIncident
