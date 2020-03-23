import React, { useState } from 'react'
import { RootState } from 'store'
import Patient from 'model/Patient'
import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'
import { useSelector, useDispatch } from 'react-redux'
import Permissions from 'model/Permissions'
import { Button, List, ListItem, Alert, Toast } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import Diagnosis from 'model/Diagnosis'
import { getTimestampId } from 'patients/util/timestamp-id-generator'
import { updatePatient } from 'patients/patient-slice'
import AddDiagnosisModal from './AddDiagnosisModal'

interface Props {
  patient: Patient
}

const Diagnoses = (props: Props) => {
  const { patient } = props
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { permissions } = useSelector((state: RootState) => state.user)

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

  const onAddDiagnosisSuccess = () => {
    Toast('success', t('states.success'), t('patient.diagnoses.successfullyAdded'))
  }

  const onDiagnosisSave = (diagnosis: Diagnosis) => {
    diagnosis.id = getTimestampId()
    const diagnoses = []
    if (patient.diagnoses) {
      diagnoses.push(...patient.diagnoses)
    }
    diagnoses.push(diagnosis)
    const patientToUpdate = { ...patient, diagnoses }
    dispatch(updatePatient(patientToUpdate, onAddDiagnosisSuccess))
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
      {(!patient.diagnoses || patient.diagnoses.length === 0) && (
        <Alert
          color="warning"
          title={t('patient.diagnoses.warning.noDiagnoses')}
          message={t('patient.diagnoses.addDiagnosisAbove')}
        />
      )}
      <List>
        {patient.diagnoses?.map((a: Diagnosis) => (
          <ListItem key={a.id}>{a.name}</ListItem>
        ))}
      </List>
      <AddDiagnosisModal
        show={showDiagnosisModal}
        onCloseButtonClick={onAddDiagnosisModalClose}
        onSave={onDiagnosisSave}
      />
    </>
  )
}

export default Diagnoses
