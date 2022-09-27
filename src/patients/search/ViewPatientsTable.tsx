import { Table } from '@hospitalrun/components'
import React from 'react'
//import { AnyIfEmpty } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import { formatDate } from '../../shared/util/formatDate'
import usePatients from '../hooks/usePatients'
import PatientSearchRequest from '../models/PatientSearchRequest'
import NoPatientsExist from './NoPatientsExist'

interface Props {
  searchRequest: PatientSearchRequest
  filtered:Boolean
  patientData:Patient[]
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
    <>
    <Table
    
      data={props.filtered ? props.patientData : data.patients}
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
    {console.log('patientdata: ',props.patientData)}
    </>
  )
}

export default ViewPatientsTable
