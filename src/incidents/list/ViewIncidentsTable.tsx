import { Spinner, Table, Dropdown } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router'

import useTranslator from '../../shared/hooks/useTranslator'
import { DownloadLink, getCSV } from '../../shared/util/DataHelpers'
import { extractUsername } from '../../shared/util/extractUsername'
import useIncidents from '../hooks/useIncidents'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

interface Props {
  searchRequest: IncidentSearchRequest
}

export function populateExportData(dataToPopulate: any, theData: any) {
  let first = true
  if (theData != null) {
    theData.forEach((elm: any) => {
      const entry = {
        code: elm.code,
        date: format(new Date(elm.date), 'yyyy-MM-dd hh:mm a'),
        reportedBy: elm.reportedBy,
        reportedOn: format(new Date(elm.reportedOn), 'yyyy-MM-dd hh:mm a'),
        status: elm.status,
      }
      if (first) {
        dataToPopulate[0] = entry
        first = false
      } else {
        dataToPopulate.push(entry)
      }
    })
  }
}

function ViewIncidentsTable(props: Props) {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, isLoading } = useIncidents(searchRequest)

  if (data === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  // filter data
  const exportData = [{}]

  function downloadCSV() {
    populateExportData(exportData, data)

    const csv = getCSV(exportData)

    const incidentsText = t('incidents.label')

    const filename = incidentsText
      .concat('-')
      .concat(format(new Date(Date.now()), 'yyyy-MM-dd--hh-mma'))
      .concat('.csv')

    DownloadLink(csv, filename)
  }

  const dropdownItems = [
    {
      onClick: function runfun() {
        downloadCSV()
      },
      text: 'CSV',
    },
  ]

  const dropStyle = {
    marginLeft: 'auto', // note the capital 'W' here
    marginBottom: '4px', // 'ms' is the only lowercase vendor prefix
  }

  return (
    <>
      <Dropdown
        direction="down"
        variant="secondary"
        text={t('incidents.reports.download')}
        style={dropStyle}
        items={dropdownItems}
      />
      <Table
        getID={(row) => row.id}
        data={data}
        columns={[
          {
            label: t('incidents.reports.code'),
            key: 'code',
          },
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
          {
            label: t('incidents.reports.status'),
            key: 'status',
          },
        ]}
        actionsHeaderText={t('actions.label')}
        actions={[
          {
            label: t('actions.view'),
            action: (row) => history.push(`incidents/${row.id}`),
          },
        ]}
      />
    </>
  )
}

export default ViewIncidentsTable
