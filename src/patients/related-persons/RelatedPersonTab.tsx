import { Button, Alert, Spinner, Table } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import { removeRelatedPerson } from '../patient-slice'
import AddRelatedPersonModal from './AddRelatedPersonModal'

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
            fetchedRelatedPersons.push({ ...fetchedRelatedPerson, type: person.type })
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

  const closeNewRelatedPersonModal = () => {
    setShowRelatedPersonModal(false)
  }

  const onRelatedPersonDelete = (relatedPerson: Patient) => {
    dispatch(removeRelatedPerson(patient.id, relatedPerson.id))
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
              {t('patient.relatedPersons.add')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          {relatedPersons ? (
            relatedPersons.length > 0 ? (
              <Table
                getID={(row) => row.id}
                data={relatedPersons}
                columns={[
                  { label: t('patient.givenName'), key: 'givenName' },
                  { label: t('patient.familyName'), key: 'familyName' },
                  { label: t('patient.relatedPersons.relationshipType'), key: 'type' },
                ]}
                actionsHeaderText={t('actions.label')}
                actions={[
                  { label: t('actions.view'), action: (row) => navigateTo(`/patients/${row.id}`) },
                  {
                    label: t('actions.delete'),
                    action: (row) => onRelatedPersonDelete(row as Patient),
                    buttonColor: 'danger',
                  },
                ]}
              />
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
        </div>
      </div>

      <AddRelatedPersonModal
        show={showNewRelatedPersonModal}
        toggle={closeNewRelatedPersonModal}
        onCloseButtonClick={closeNewRelatedPersonModal}
      />
    </div>
  )
}

export default RelatedPersonTab
