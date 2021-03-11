import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import usePatientVisits from '../hooks/usePatientVisits'

interface Props {
  patientId: string
}
const VisitTable = ({ patientId }: Props) => {
  const history = useHistory()
  const { t } = useTranslator()

  const { data: patientVisits, status } = usePatientVisits(patientId)

  if (patientVisits === undefined || status === 'loading') {
    return <Loading />
  }

  if (patientVisits.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.visits.warning.noVisits')}
        message={t('patient.visits.warning.addVisitAbove')}
      />
    )
  }

  return (
    <Table
      getID={(row) => row.id}
      data={patientVisits}
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
          action: (row) => history.push(`/patients/${patientId}/visits/${row.id}`),
        },
      ]}
    />
  )
}

export default VisitTable
