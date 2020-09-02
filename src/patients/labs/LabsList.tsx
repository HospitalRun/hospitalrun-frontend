import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import usePatientLabs from '../hooks/usePatientLabs'

interface Props {
  patient: Patient
}

const LabsList = (props: Props) => {
  const { patient } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientLabs(patient.id)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.labs.warning.noLabs')}
        message={t('patient.labs.noLabsMessage')}
      />
    )
  }

  return (
    <Table
      actionsHeaderText={t('actions.label')}
      getID={(row) => row.id}
      data={data}
      columns={[
        { label: t('labs.lab.type'), key: 'type' },
        {
          label: t('labs.lab.requestedOn'),
          key: 'requestedOn',
          formatter: (row) => format(new Date(row.requestedOn), 'yyyy-MM-dd hh:mm a'),
        },
        { label: t('labs.lab.status'), key: 'status' },
      ]}
      actions={[{ label: t('actions.view'), action: (row) => history.push(`/labs/${row.id}`) }]}
    />
  )
}

export default LabsList
