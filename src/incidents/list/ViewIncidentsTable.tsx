import { Spinner, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router'

import useTranslator from '../../shared/hooks/useTranslator'
import { extractUsername } from '../../shared/util/extractUsername'
import useIncidents from '../hooks/useIncidents'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

interface Props {
  searchRequest: IncidentSearchRequest
}

function ViewIncidentsTable(props: Props) {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, isLoading } = useIncidents(searchRequest)

  if (data === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  return (
    <Table
      getID={(row) => row.id}
      data={data}
      columns={[
        { label: t('incidents.reports.code'), key: 'code' },
        {
          label: t('incidents.reports.dateOfIncident'),
          key: 'date',
          formatter: (row) => (row.date ? format(new Date(row.date), 'yyyy-MM-dd hh:mm a') : ''),
        },
        {
          label: t('incidents.reports.reportedBy'),
          key: 'reportedBy',
          formatter: (row) => extractUsername(row.reportedBy),
        },
        {
          label: t('incidents.reports.reportedOn'),
          key: 'reportedOn',
          formatter: (row) =>
            row.reportedOn ? format(new Date(row.reportedOn), 'yyyy-MM-dd hh:mm a') : '',
        },
        { label: t('incidents.reports.status'), key: 'status' },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[{ label: t('actions.view'), action: (row) => history.push(`incidents/${row.id}`) }]}
    />
  )
}

export default ViewIncidentsTable
