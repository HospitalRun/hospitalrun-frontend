import React from 'react'
import { useParams } from 'react-router'

import Loading from '../../shared/components/Loading'
import useCareGoal from '../hooks/useCareGoal'
import CareGoalForm from './CareGoalForm'

const ViewCareGoal = () => {
  const { careGoalId, id: patientId } = useParams()
  const { data: careGoal, status } = useCareGoal(patientId, careGoalId)

  if (careGoal === undefined || status === 'loading') {
    return <Loading />
  }

  return <CareGoalForm careGoal={careGoal} disabled />
}

export default ViewCareGoal
