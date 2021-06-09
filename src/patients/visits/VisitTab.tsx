import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'

import AddVisitModal from './AddVisitModal'
import ViewVisit from './ViewVisit'
import VisitTable from './VisitTable'

interface Props {
  patientId: string
}

const VisitTab = ({ patientId }: Props) => {
  const [showAddVisitModal, setShowAddVisitModal] = useState(false)
  return (
    <>
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
