import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import usePatientCareGoals from '../hooks/usePatientCareGoals'

interface Props {
  patientId: string
}

const CareGoalTable = (props: Props) => {
  const { patientId } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientCareGoals(patientId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.careGoals.warning.noCareGoals')}
        message={t('patient.careGoals.warning.addCareGoalAbove')}
      />
    )
  }

  return (
    <Table
      getID={(row) => row.id}
      data={data}
      columns={[
        { label: t('patient.careGoal.description'), key: 'description' },
        {
          label: t('patient.careGoal.startDate'),
          key: 'startDate',
          formatter: (row) => format(new Date(row.startDate), 'yyyy-MM-dd'),
        },
        {
          label: t('patient.careGoal.dueDate'),
          key: 'dueDate',
          formatter: (row) => format(new Date(row.dueDate), 'yyyy-MM-dd'),
        },
        {
          label: t('patient.careGoal.status'),
          key: 'status',
        },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[
        {
          label: t('actions.view'),
          action: (row) => history.push(`/patients/${patientId}/care-goals/${row.id}`),
        },
      ]}
    />
  )
}

export default CareGoalTable
