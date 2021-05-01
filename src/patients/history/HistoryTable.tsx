import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import { HistoryRecordType, PatientHistoryRecord } from '../../shared/model/PatientHistoryRecord'
import usePatientAppointments from '../hooks/usePatientAppointments'
import usePatientLabs from '../hooks/usePatientLabs'
import { mapHistoryRecords } from './mappers/HistoryRecordsMapper'

interface Props {
  patientId: string
}

const getRecordPath = (historyRecord: PatientHistoryRecord): string => {
  if (historyRecord.type === HistoryRecordType.LAB) {
    return `/labs/${historyRecord.recordId}`
  }
  return `/appointments/${historyRecord.recordId}`
}

const HistoryTable = ({ patientId }: Props) => {
  const { t } = useTranslator()
  const history = useHistory()

  const { data: labs } = usePatientLabs(patientId)
  const { data: appointments } = usePatientAppointments(patientId)

  const mappedHistoryRecords = mapHistoryRecords(labs, appointments)

  if (mappedHistoryRecords.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.history.noHistoryTitle')}
        message={t('patient.history.noHistoryMessage')}
      />
    )
  }
  return (
    <Table
      getID={(row) => row.id}
      data={mappedHistoryRecords}
      columns={[
        {
          label: t('patient.history.eventDate'),
          key: 'date',
          formatter: (row) => format(new Date(row.date), 'yyyy-MM-dd hh:mm a'),
        },
        {
          label: t('patient.history.recordType'),
          key: 'type',
        },
        {
          label: t('patient.history.information'),
          key: 'info',
        },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[
        {
          label: t('actions.view'),
          action: (row) => history.push(getRecordPath(row as PatientHistoryRecord)),
        },
      ]}
    />
  )
}

export default HistoryTable
