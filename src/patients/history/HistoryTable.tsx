import { Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import { HistoryRecordType, PatientHistoryRecord } from '../../shared/model/PatientHistoryRecord'
import usePatientsAppointments from '../hooks/usePatientAppointments'
import usePatientLabs from '../hooks/usePatientLabs'
import { mapHistoryRecords } from './mappers/HistoryRecordsMapper'

interface Props {
  patientId: string
}

const HistoryTable = ({ patientId }: Props) => {
  const { t } = useTranslator()
  const history = useHistory()

  const { data: labs } = usePatientLabs(patientId)
  const { data: appointments } = usePatientsAppointments(patientId)

  const historyElements = mapHistoryRecords(labs, appointments)

  return (
    <Table
      getID={(row) => row.id}
      data={historyElements}
      columns={[
        {
          label: t('patient.history.entryDate'),
          key: 'date',
          formatter: (row) => format(new Date(row.date), 'yyyy-MM-dd hh:mm a'),
        },
        { label: t('patient.history.recordType'), key: 'type' },
        { label: t('patient.history.information'), key: 'info' },
      ]}
      actionsHeaderText = {t('actions.label')}
      actions={[
        {
          label: t('actions.view'),
          action: (row) => history.push(getRecordPath(row as PatientHistoryRecord)),
        },
      ]}
    />
  )
}

const getRecordPath = (historyRecord: PatientHistoryRecord): string => {
  if (historyRecord.type === HistoryRecordType.LAB) {
    return `/labs/${historyRecord.recordId}`
  }
  return `/appointments/${historyRecord.recordId}`
}

export default HistoryTable
