import { Spinner, Table, Dropdown } from '@hospitalrun/components'
import format from 'date-fns/format'
import { Parser } from 'json2csv'
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

  // filter data
  const exportData = [{}]
  let first = true
  if (data != null) {
    data.forEach((elm) => {
      const entry = {
        code: elm.code,
        date: format(new Date(elm.date), 'yyyy-MM-dd hh:mm a'),
        reportedBy: elm.reportedBy,
        reportedOn: format(new Date(elm.reportedOn), 'yyyy-MM-dd hh:mm a'),
        status: elm.status,
      }
      if (first) {
        exportData[0] = entry
        first = false
      } else {
        exportData.push(entry)
      }
    })
  }

  function downloadCSV() {
    const fields = Object.keys(exportData[0])
    const opts = { fields }
    const parser = new Parser(opts)
    const csv = parser.parse(exportData)
    console.log(csv)

    const incidentsText = t('incidents.label')
    const filename = incidentsText.concat('.csv')

    const text = csv
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  const dropdownItems = [
    {
      onClick: function runfun() {
        downloadCSV()
      },
      text: 'CSV',
    },
  ]

  return (
    <>
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
      <Dropdown direction="down" variant="secondary" text="DOWNLOAD" items={dropdownItems} />
    </>
  )
}

export default ViewIncidentsTable
