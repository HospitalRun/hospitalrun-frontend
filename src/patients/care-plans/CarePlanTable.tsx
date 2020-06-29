import { Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { RootState } from '../../shared/store'

const CarePlanTable = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { patient } = useSelector((state: RootState) => state.patient)

  return (
    <Table
      tableClassName="table table-hover"
      getID={(row) => row.id}
      data={patient.carePlans || []}
      columns={[
        { label: t('patient.carePlan.title'), key: 'title' },
        {
          label: t('patient.carePlan.startDate'),
          key: 'startDate',
          formatter: (row) => format(new Date(row.startDate), 'yyyy-MM-dd'),
        },
        {
          label: t('patient.carePlan.endDate'),
          key: 'endDate',
          formatter: (row) => format(new Date(row.endDate), 'yyyy-MM-dd'),
        },
        { label: t('patient.carePlan.status'), key: 'status' },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[
        {
          label: 'actions.view',
          action: (row) => history.push(`/patients/${patient.id}/care-plans/${row.id}`),
        },
      ]}
    />
  )
}

export default CarePlanTable
