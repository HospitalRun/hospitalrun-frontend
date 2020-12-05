import React from 'react'
import { useParams } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useDiagnosis from '../hooks/useDiagnosis'
import usePatient from '../hooks/usePatient'
import DiagnosisForm from './DiagnosisForm'

const ViewDiagnosis = () => {
  const { diagnosisId, id: patientId } = useParams()
  const { data: patient, status: patientStatus } = usePatient(patientId)
  const { data: diagnosis, status: diagnosisStatus } = useDiagnosis(patientId, diagnosisId)

  if (
    patient === undefined ||
    diagnosis === undefined ||
    patientStatus === 'loading' ||
    diagnosisStatus === 'loading'
  ) {
    return <Loading />
  }

  if (diagnosis) {
    return (
      <>
        <h2>{diagnosis.name}</h2>
        <DiagnosisForm patient={patient} diagnosis={diagnosis} disabled />
      </>
    )
  }
  return (
    <>
      <h2>This did not work.</h2>
    </>
  )
}

export default ViewDiagnosis
