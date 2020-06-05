import findLast from 'lodash/findLast'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import CarePlan from '../../model/CarePlan'
import { RootState } from '../../store'
import CarePlanForm from './CarePlanForm'

const ViewCarePlan = () => {
  const { patient } = useSelector((root: RootState) => root.patient)
  const { carePlanId } = useParams()

  const [carePlan, setCarePlan] = useState<CarePlan | undefined>()

  useEffect(() => {
    if (patient && carePlanId) {
      const currentCarePlan = findLast(patient.carePlans, (c: CarePlan) => c.id === carePlanId)
      setCarePlan(currentCarePlan)
    }
  }, [setCarePlan, carePlanId, patient])

  if (carePlan) {
    return (
      <>
        <h2>{carePlan?.title}</h2>
        <CarePlanForm patient={patient} carePlan={carePlan} disabled />
      </>
    )
  }
  return <></>
}

export default ViewCarePlan
