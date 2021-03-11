import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import AddVisitModal from './AddVisitModal'
import ViewVisit from './ViewVisit'
import VisitTable from './VisitTable'

interface Props {
  patientId: string
}

const VisitTab = ({ patientId }: Props) => {
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showAddVisitModal, setShowAddVisitModal] = useState(false)
  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddVisit) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowAddVisitModal(true)}
            >
              {t('patient.visits.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <Switch>
        <Route exact path="/patients/:id/visits">
          <VisitTable patientId={patientId} />
        </Route>
        <Route exact path="/patients/:id/visits/:visitId">
          <ViewVisit patientId={patientId} />
        </Route>
      </Switch>
      <AddVisitModal
        show={showAddVisitModal}
        patientId={patientId}
        onCloseButtonClick={() => setShowAddVisitModal(false)}
      />
    </>
  )
}

export default VisitTab
