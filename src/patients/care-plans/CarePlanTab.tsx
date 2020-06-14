import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Permissions from '../../model/Permissions'
import { RootState } from '../../store'
import AddCarePlanModal from './AddCarePlanModal'
import CarePlanTable from './CarePlanTable'
import ViewCarePlan from './ViewCarePlan'

const CarePlanTab = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showAddCarePlanModal, setShowAddCarePlanModal] = useState(false)
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
        <Route exact path={path}>
          <CarePlanTable />
        </Route>
        <Route exact path={`${path}/:carePlanId`}>
          <ViewCarePlan />
        </Route>
      </Switch>
      <AddCarePlanModal
        show={showAddCarePlanModal}
        onCloseButtonClick={() => setShowAddCarePlanModal(false)}
      />
    </>
  )
}

export default CarePlanTab
