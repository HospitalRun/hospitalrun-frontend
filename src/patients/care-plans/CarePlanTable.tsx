import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import usePatientCarePlans from '../hooks/usePatientCarePlans'

interface Props {
  patientId: string
}

const CarePlanTable = (props: Props) => {
  const { patientId } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientCarePlans(patientId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.carePlans.warning.noCarePlans')}
        message={t('patient.carePlans.warning.addCarePlanAbove')}
      />
    )
  }

  return (
    <Table
      getID={(row) => row.id}
      data={data}
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
          label: t('actions.view'),
          action: (row) => history.push(`/patients/${patientId}/care-plans/${row.id}`),
        },
      ]}
    />
  )
}

export default CarePlanTable
