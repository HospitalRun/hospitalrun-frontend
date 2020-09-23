import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Route, Switch } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import usePatient from '../hooks/usePatient'
import AddCareGoalModal from './AddCareGoalModal'
import ViewCareGoal from './ViewCareGoal'
import ViewCareGoals from './ViewCareGoals'

const CareGoalTab = () => {
  const { id: patientId } = useParams()
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { data, status } = usePatient(patientId)
  const [showAddCareGoalModal, setShowAddCareGoalModal] = useState(false)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddCareGoal) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowAddCareGoalModal(true)}
            >
              {t('patient.careGoal.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <Switch>
        <Route exact path="/patients/:id/care-goals">
          <ViewCareGoals />
        </Route>
        <Route exact path="/patients/:id/care-goals/:careGoalId">
          <ViewCareGoal />
        </Route>
      </Switch>
      <AddCareGoalModal
        patient={data}
        show={showAddCareGoalModal}
        onCloseButtonClick={() => setShowAddCareGoalModal(false)}
      />
    </>
  )
}

export default CareGoalTab
