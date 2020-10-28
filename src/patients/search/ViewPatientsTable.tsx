import { Table } from '@hospitalrun/components'
import React from 'react'
import { useHistory } from 'react-router'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import { formatDate } from '../../shared/util/formatDate'
import usePatients from '../hooks/usePatients'
import PatientSearchRequest from '../models/PatientSearchRequest'
import NoPatientsExist from './NoPatientsExist'

interface Props {
  searchRequest: PatientSearchRequest
}

const ViewPatientsTable = (props: Props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, status } = usePatients(searchRequest)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.totalCount === 0) {
    return <NoPatientsExist />
  }

  return (
    <Table
      data={data.patients}
      getID={(row) => row.id}
      columns={[
        { label: t('patient.code'), key: 'code' },
        { label: t('patient.givenName'), key: 'givenName' },
        { label: t('patient.familyName'), key: 'familyName' },
        { label: t('patient.sex'), key: 'sex' },
        {
          label: t('patient.dateOfBirth'),
          key: 'dateOfBirth',
          formatter: (row) => formatDate(row.dateOfBirth),
        },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[{ label: t('actions.view'), action: (row) => history.push(`/patients/${row.id}`) }]}
    />
  )
}

export default ViewPatientsTable
