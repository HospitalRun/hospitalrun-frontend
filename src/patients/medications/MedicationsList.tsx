import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import usePatientMedications from '../hooks/usePatientMedications'

interface Props {
  patient: Patient
}

const MedicationsList = (props: Props) => {
  const { patient } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientMedications(patient.id)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.medications.warning.noMedications')}
        message={t('patient.medications.noMedicationsMessage')}
      />
    )
  }

  return (
    <Table
      actionsHeaderText={t('actions.label')}
      getID={(row) => row.id}
      data={data}
      columns={[
        { label: t('medications.medication.medication'), key: 'medication' },
        { label: t('medications.medication.priority'), key: 'priority' },
        { label: t('medications.medication.intent'), key: 'intent' },
        {
          label: t('medications.medication.requestedOn'),
          key: 'requestedOn',
          formatter: (row) =>
            row.requestedOn ? format(new Date(row.requestedOn), 'yyyy-MM-dd hh:mm a') : '',
        },
        { label: t('medications.medication.status'), key: 'status' },
      ]}
      actions={[
        { label: t('actions.view'), action: (row) => history.push(`/medications/${row.id}`) },
      ]}
    />
  )
}

export default MedicationsList
