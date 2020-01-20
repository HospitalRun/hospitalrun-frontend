import React, { useState } from 'react'
import { Button, Panel, List, ListItem } from '@hospitalrun/components'
import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import RelatedPerson from 'model/RelatedPerson'
import { useTranslation } from 'react-i18next'
import Patient from 'model/Patient'
import { updatePatient } from 'patients/patient-slice'
import { getPatientName } from 'patients/util/patient-name-util'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Permissions from 'model/Permissions'

interface Props {
  patient: Patient
}

const RelatedPersonTab = (props: Props) => {
  const dispatch = useDispatch()
  const { patient } = props
  const { t } = useTranslation()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewRelatedPersonModal, setShowRelatedPersonModal] = useState<boolean>(false)

  const onNewRelatedPersonClick = () => {
    setShowRelatedPersonModal(true)
  }

  const closeNewRelatedPersonModal = () => {
    setShowRelatedPersonModal(false)
  }

  const onRelatedPersonSave = (relatedPerson: RelatedPerson) => {
    console.log('on related person save')
    const patientToUpdate = {
      ...patient,
    }
    relatedPerson.fullName = getPatientName(
      relatedPerson.givenName,
      relatedPerson.familyName,
      relatedPerson.suffix,
    )
    if (!patientToUpdate.relatedPersons) {
      patientToUpdate.relatedPersons = []
    }

    patientToUpdate.relatedPersons.push(relatedPerson)
    dispatch(updatePatient(patientToUpdate))
    closeNewRelatedPersonModal()
  }

  let relatedPersonsList
  if (patient.relatedPersons) {
    relatedPersonsList = patient.relatedPersons.map((p) => <ListItem>{p.fullName}</ListItem>)
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.WritePatients) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={onNewRelatedPersonClick}
            >
              {t('patient.relatedPersons.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          <Panel title={t('patient.relatedPersons.label')} color="primary" collapsible>
            <List>{relatedPersonsList}</List>
          </Panel>
        </div>
      </div>

      <NewRelatedPersonModal
        show={showNewRelatedPersonModal}
        toggle={closeNewRelatedPersonModal}
        onCloseButtonClick={closeNewRelatedPersonModal}
        onSave={onRelatedPersonSave}
      />
    </div>
  )
}

export default RelatedPersonTab
