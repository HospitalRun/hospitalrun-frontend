import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import AddDiagnosisModal from './AddDiagnosisModal'
import DiagnosesList from './DiagnosesList'

interface Props {
  patient: Patient
}

const Diagnoses = (props: Props) => {
  const { patient } = props
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false)

  const breadcrumbs = [
    {
      i18nKey: 'patient.diagnoses.label',
      location: `/patients/${patient.id}/diagnoses`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onAddDiagnosisModalClose = () => {
    setShowDiagnosisModal(false)
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
      <DiagnosesList patientId={patient.id} />
      <AddDiagnosisModal
        show={showDiagnosisModal}
        onCloseButtonClick={onAddDiagnosisModalClose}
        patient={patient}
      />
    </>
  )
}

export default Diagnoses
