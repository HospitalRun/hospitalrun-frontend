import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import usePatientDiagnoses from '../hooks/usePatientDiagnoses'

interface Props {
  patientId: string
}

const DiagnosisTable = (props: Props) => {
  const { patientId } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientDiagnoses(patientId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.diagnoses.warning.noDiagnoses')}
        message={t('patient.diagnoses.addDiagnosisAbove')}
      />
    )
  }

  return (
    <Table
      getID={(row) => row.id}
      data={data}
      columns={[
        { label: t('patient.diagnoses.diagnosisName'), key: 'name' },
        {
          label: t('patient.diagnoses.diagnosisDate'),
          key: 'diagnosisDate',
          formatter: (row) =>
            format(row.diagnosisDate ? new Date(row.diagnosisDate) : new Date(0), 'yyyy-MM-dd'),
        },
        {
          label: t('patient.diagnoses.onsetDate'),
          key: 'onsetDate',
          formatter: (row) =>
            format(row.onsetDate ? new Date(row.onsetDate) : new Date(0), 'yyyy-MM-dd'),
        },
        {
          label: t('patient.diagnoses.abatementDate'),
          key: 'abatementDate',
          formatter: (row) =>
            format(row.abatementDate ? new Date(row.abatementDate) : new Date(0), 'yyyy-MM-dd'),
        },
        { label: t('patient.diagnoses.status'), key: 'status' },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[
        {
          label: t('actions.view'),
          action: (row) => history.push(`/patients/${patientId}/diagnoses/${row.id}`),
        },
      ]}
    />
  )
}

export default DiagnosisTable
