import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useParams } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import usePatient from '../hooks/usePatient'
import AddDiagnosisModal from './AddDiagnosisModal'
import ViewDiagnoses from './ViewDiagnoses'
import ViewDiagnosis from './ViewDiagnosis'

const Diagnoses = () => {
  const { id: patientId } = useParams()
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { data, status } = usePatient(patientId)
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false)

  const breadcrumbs = [
    {
      i18nKey: 'patient.diagnoses.label',
      location: `/patients/${patientId}/diagnoses`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onAddDiagnosisModalClose = () => {
    setShowDiagnosisModal(false)
  }

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddDiagnosis) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowDiagnosisModal(true)}
            >
              {t('patient.diagnoses.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <Switch>
        <Route exact path="/patients/:id/diagnoses">
          <ViewDiagnoses />
        </Route>
        <Route exact path="/patients/:id/diagnoses/:diagnosisId">
          <ViewDiagnosis />
        </Route>
      </Switch>
      <AddDiagnosisModal
        show={showDiagnosisModal}
        onCloseButtonClick={onAddDiagnosisModalClose}
        patient={data}
      />
    </>
  )
}

export default Diagnoses
