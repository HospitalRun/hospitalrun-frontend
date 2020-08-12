import { Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import { RootState } from '../../shared/store'

const VisitTable = () => {
  const history = useHistory()
  const { t } = useTranslator()
  const { patient } = useSelector((state: RootState) => state.patient)

  return (
    <Table
      getID={(row) => row.id}
      data={patient.visits || []}
      columns={[
        {
          label: t('patient.visits.startDateTime'),
          key: 'startDateTime',
          formatter: (row) => format(new Date(row.startDateTime), 'yyyy-MM-dd hh:mm a'),
        },
        {
          label: t('patient.visits.endDateTime'),
          key: 'endDateTime',
          formatter: (row) => format(new Date(row.endDateTime), 'yyyy-MM-dd hh:mm a'),
        },
        { label: t('patient.visits.type'), key: 'type' },
        { label: t('patient.visits.status'), key: 'status' },
        { label: t('patient.visits.reason'), key: 'reason' },
        { label: t('patient.visits.location'), key: 'location' },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[
        {
          label: t('actions.view'),
          action: (row) => history.push(`/patients/${patient.id}/visits/${row.id}`),
        },
      ]}
    />
  )
}

export default VisitTable
