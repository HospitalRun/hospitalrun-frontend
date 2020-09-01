import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useParams } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import usePatient from '../hooks/usePatient'
import AddCarePlanModal from './AddCarePlanModal'
import ViewCarePlan from './ViewCarePlan'
import ViewCarePlans from './ViewCarePlans'

const CarePlanTab = () => {
  const { id: patientId } = useParams()
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { data, status } = usePatient(patientId)
  const [showAddCarePlanModal, setShowAddCarePlanModal] = useState(false)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddCarePlan) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowAddCarePlanModal(true)}
            >
              {t('patient.carePlan.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <Switch>
        <Route exact path="/patients/:id/care-plans">
          <ViewCarePlans />
        </Route>
        <Route exact path="/patients/:id/care-plans/:carePlanId">
          <ViewCarePlan />
        </Route>
      </Switch>
      <AddCarePlanModal
        patient={data}
        show={showAddCarePlanModal}
        onCloseButtonClick={() => setShowAddCarePlanModal(false)}
      />
    </>
  )
}

export default CarePlanTab
