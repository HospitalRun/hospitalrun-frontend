import React, { useState, useEffect } from 'react'
import { Button, Panel, List, ListItem } from '@hospitalrun/components'
import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import RelatedPerson from 'model/RelatedPerson'
import { useTranslation } from 'react-i18next'
import { updatePatient } from 'patients/patient-slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Permissions from 'model/Permissions'
import PersonRepository from 'clients/db/PersonRepository'
import Person from 'model/Person'

interface Props {
  person: Person
}

const RelatedPersonTab = (props: Props) => {
  const dispatch = useDispatch()
  const { person } = props
  const { t } = useTranslation()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewRelatedPersonModal, setShowRelatedPersonModal] = useState<boolean>(false)
  const [relatedPersons, setRelatedPersons] = useState<RelatedPerson[] | undefined>(undefined)

  useEffect(() => {
    const fetchRelatedPersons = async () => {
      const fetchedRelatedPersons: RelatedPerson[] = []
      if (person.relatedPersons) {
        await Promise.all(
          patient.relatedPersons.map(async (person) => {
            const fetchedRelatedPerson = await PersonRepository.find(person.relatedPatientId)
            fetchedRelatedPersons.push(fetchedRelatedPerson)
          }),
        )

        setRelatedPersons(fetchedRelatedPersons)
      }
    }

    fetchRelatedPersons()
  }, [patient.relatedPersons])

  const onNewRelatedPersonClick = () => {
    setShowRelatedPersonModal(true)
  }

  const closeNewRelatedPersonModal = () => {
    setShowRelatedPersonModal(false)
  }

  const onRelatedPersonSave = (relatedPerson: RelatedPerson) => {
    const patientToUpdate = {
      ...patient,
    }

    if (!patientToUpdate.relatedPersons) {
      patientToUpdate.relatedPersons = []
    }

    patientToUpdate.relatedPersons.push(relatedPerson)
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
            {relatedPersons ? (
              <List>
                {relatedPersons.map((r) => (
                  <ListItem key={r.id}>{r.fullName}</ListItem>
                ))}
              </List>
            ) : (
              <h1>Loading...</h1>
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
