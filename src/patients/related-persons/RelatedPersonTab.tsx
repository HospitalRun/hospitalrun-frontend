import React, { useState, useEffect } from 'react'
import { Button, Panel, List, ListItem, Alert, Spinner } from '@hospitalrun/components'
import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import RelatedPerson from 'model/RelatedPerson'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import Patient from 'model/Patient'
import { addRelatedPerson } from 'patients/patient-slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Permissions from 'model/Permissions'
import PatientRepository from 'clients/db/PatientRepository'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'

interface Props {
  patient: Patient
}

const RelatedPersonTab = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const navigateTo = (location: string) => {
    history.push(location)
  }
  const { patient } = props
  const { t } = useTranslation()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewRelatedPersonModal, setShowRelatedPersonModal] = useState<boolean>(false)
  const [relatedPersons, setRelatedPersons] = useState<Patient[] | undefined>(undefined)

  const breadcrumbs = [
    {
      i18nKey: 'patient.relatedPersons.label',
      location: `/patients/${patient.id}/relatedpersons`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

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
      }

      setRelatedPersons(fetchedRelatedPersons)
    }

    fetchRelatedPersons()
  }, [patient.relatedPersons])

  const onNewRelatedPersonClick = () => {
    setShowRelatedPersonModal(true)
  }

  const onRelatedPersonClick = (id: string) => {
    navigateTo(`/patients/${id}`)
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

    dispatch(addRelatedPerson(patientToUpdate, history))
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
              relatedPersons.length > 0 ? (
                <List>
                  {relatedPersons.map((r) => (
                    <ListItem action key={r.id} onClick={() => onRelatedPersonClick(r.id)}>
                      {r.fullName}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert
                  color="warning"
                  title={t('patient.relatedPersons.warning.noRelatedPersons')}
                  message={t('patient.relatedPersons.addRelatedPersonAbove')}
                />
              )
            ) : (
              <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
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
