import React from 'react'
import { useParams } from 'react-router-dom'

import DiagnosisTable from './DiagnosisTable'

const ViewDiagnoses = () => {
  const { id } = useParams()

  return <DiagnosisTable patientId={id} />
}

export default ViewDiagnoses
