import { Button, Alert, Spinner, Table } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import usePatientRelatedPersons from '../hooks/usePatientRelatedPersons'
import useRemovePatientRelatedPerson from '../hooks/useRemovePatientRelatedPerson'
import AddRelatedPersonModal from './AddRelatedPersonModal'

interface Props {
  patient: Patient
}

const RelatedPersonTab = (props: Props) => {
  const history = useHistory()

  const navigateTo = (location: string) => {
    history.push(location)
  }
  const { patient } = props
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewRelatedPersonModal, setShowRelatedPersonModal] = useState<boolean>(false)
  const [mutate] = useRemovePatientRelatedPerson()

  const breadcrumbs = [
    {
      i18nKey: 'patient.relatedPersons.label',
      location: `/patients/${patient.id}/relatedpersons`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const { data: relatedPersons } = usePatientRelatedPersons(patient.id)

  const onNewRelatedPersonClick = () => {
    setShowRelatedPersonModal(true)
  }

  const closeNewRelatedPersonModal = () => {
    setShowRelatedPersonModal(false)
  }

  const onRelatedPersonDelete = (relatedPerson: Patient) => {
    mutate({ patientId: patient.id, relatedPersonId: relatedPerson.id })
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
        patientId={patient.id}
        show={showNewRelatedPersonModal}
        toggle={closeNewRelatedPersonModal}
        onCloseButtonClick={closeNewRelatedPersonModal}
      />
    </div>
  )
}

export default RelatedPersonTab
