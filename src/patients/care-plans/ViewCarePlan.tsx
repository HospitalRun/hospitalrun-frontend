import React from 'react'
import { useParams } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useCarePlan from '../hooks/useCarePlan'
import usePatient from '../hooks/usePatient'
import CarePlanForm from './CarePlanForm'

const ViewCarePlan = () => {
  const { carePlanId, id: patientId } = useParams()
  const { data: patient, status: patientStatus } = usePatient(patientId)
  const { data: carePlan, status: carePlanStatus } = useCarePlan(patientId, carePlanId)

  if (
    patient === undefined ||
    carePlan === undefined ||
    patientStatus === 'loading' ||
    carePlanStatus === 'loading'
  ) {
    return <Loading />
  }

  if (carePlan) {
    return (
      <>
        <h2>{carePlan.title}</h2>
        <CarePlanForm patient={patient} carePlan={carePlan} disabled />
      </>
    )
  }
  return <></>
}

export default ViewCarePlan
