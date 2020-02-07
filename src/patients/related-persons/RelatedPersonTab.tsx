import React, { useState, useEffect } from 'react'
import { Button, Panel, List, ListItem, Alert, Spinner } from '@hospitalrun/components'
import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import RelatedPerson from 'model/RelatedPerson'
import { useTranslation } from 'react-i18next'
import Patient from 'model/Patient'
import { updatePatient } from 'patients/patient-slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Permissions from 'model/Permissions'
import PatientRepository from 'clients/db/PatientRepository'

interface Props {
  patient: Patient
}

const RelatedPersonTab = (props: Props) => {
  const dispatch = useDispatch()
  const { patient } = props
  const { t } = useTranslation()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewRelatedPersonModal, setShowRelatedPersonModal] = useState<boolean>(false)
  const [relatedPersons, setRelatedPersons] = useState<Patient[] | undefined>(undefined)
  const [isLoading, setisLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchRelatedPersons = async () => {
      const fetchedRelatedPersons: Patient[] = []
      if (patient.relatedPersons) {
        await Promise.all(
          patient.relatedPersons.map(async (person) => {
            const fetchedRelatedPerson = await PatientRepository.find(person.patientId)
            fetchedRelatedPersons.push(fetchedRelatedPerson)
          }),
        )

        setRelatedPersons(fetchedRelatedPersons)
      }
      setisLoading(false)
    }
    if(patient.id) {
      fetchRelatedPersons()
    }
  }, [patient.relatedPersons, patient.id])

  const onNewRelatedPersonClick = () => {
    setShowRelatedPersonModal(true)
  }

  const closeNewRelatedPersonModal = () => {
    setShowRelatedPersonModal(false)
  }

  const onRelatedPersonSave = (relatedPerson: RelatedPerson) => {
    const newRelatedPersons: RelatedPerson[] = []

    if (patient.relatedPersons) {
      newRelatedPersons.push(...patient.relatedPersons)
    }

    newRelatedPersons.push(relatedPerson)

    const patientToUpdate = {
      ...patient,
      relatedPersons: newRelatedPersons,
    }

    dispatch(updatePatient(patientToUpdate))
    closeNewRelatedPersonModal()
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
            {isLoading ? (
                <Spinner color="blue" loading size={[10,25]} type="ScaleLoader"/>
              ) : (
              relatedPersons ? (
                <List>
                  {relatedPersons.map((r) => (
                    <ListItem key={r.id}>{r.fullName}</ListItem>
                  ))}
                </List>
                  ) : (
                    <Alert color="warning" title={"No Related Persons Added"} message={"Click on the top-right button to add new related persons"}/>
                  )
            )}
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
