import { Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Medication from '../../shared/model/Medication'
import useMedicationRequestSearch from '../hooks/useMedicationSearch'
import MedicationSearchRequest from '../models/MedicationSearchRequest'

interface Props {
  searchRequest: MedicationSearchRequest
}

const MedicationRequestTable = (props: Props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, status } = useMedicationRequestSearch(searchRequest)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  const onViewClick = (medication: Medication) => {
    history.push(`/medications/${medication.id}`)
  }

  return (
    <Table
      getID={(row) => row.id}
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
      data={data}
      actionsHeaderText={t('actions.label')}
      actions={[{ label: t('actions.view'), action: (row) => onViewClick(row as Medication) }]}
    />
  )
}

export default MedicationRequestTable
