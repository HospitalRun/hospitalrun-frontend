import { Alert, List, ListItem } from '@hospitalrun/components'
import React from 'react'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Diagnosis from '../../shared/model/Diagnosis'
import usePatientDiagnoses from '../hooks/usePatientDiagnoses'

interface Props {
  patientId: string
}

const DiagnosesList = (props: Props) => {
  const { patientId } = props
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
    <List>
      {data.map((diagnosis: Diagnosis) => (
        <ListItem key={diagnosis.id}>{diagnosis.name}</ListItem>
      ))}
    </List>
  )
}

export default DiagnosesList
