import { Button, Alert, Spinner, Table, Toast } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import { removeRelatedPerson, createPatient, addRelatedPersonError } from '../patient-slice'
import AddRelatedPersonPanel from './AddRelatedPersonPanel'
import CreateRelatedPersonPanel from './CreateRelatedPersonPanel'

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
  const [showNewRelatedPersonPanel, setShowRelatedPersonPanel] = useState<boolean>(false)
  const [showCreateRelatedPersonPanel, setShowCreateRelatedPersonPanel] = useState<boolean>(false)
  const [relatedPersons, setRelatedPersons] = useState<Patient[] | undefined>(undefined)
  const [relatedPerson, setRelatedPerson] = useState({
    patientId: '',
    type: '',
  })

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
    setShowRelatedPersonPanel(true)
  }

  const closeNewRelatedPersonPanel = () => {
    setShowRelatedPersonPanel(false)
    setShowCreateRelatedPersonPanel(false)
    setRelatedPerson({
      patientId: '',
      type: '',
    })
  }

  const showCreateRelatedPerson = () => {
    setShowCreateRelatedPersonPanel(true)
  }

  const closeCreateRelatedPerson = () => {
    setShowCreateRelatedPersonPanel(false)
    dispatch(addRelatedPersonError({}))
  }

  const onRelatedPersonDelete = (relatedPatient: Patient) => {
    dispatch(removeRelatedPerson(patient.id, relatedPatient.id))
  }

  const onTypeChange = (val: string) => {
    setRelatedPerson({
      ...relatedPerson,
      type: val,
    })
  }

  /*   --------------------- New Patient creation --------------------------- */

  const { createError } = useSelector((state: RootState) => state.patient)
  const [newRelatedPatient, setNewRelatedPatient] = useState({} as Patient)
  const onSuccessfulSave = (newPatient: Patient) => {
    Toast(
      'success',
      t('states.success'),
      `${t('patients.successfullyCreated')} ${newPatient.fullName}`,
    )
  }
  const onSave = () => {
    dispatch(createPatient(newRelatedPatient, onSuccessfulSave))
    // dispatch(addRelatedPerson(patient.id, relatedPerson as RelatedPerson))
    dispatch(addRelatedPersonError({})) /* maybe remove in cleanup if not needed */
    closeCreateRelatedPerson()
    setRelatedPerson({
      patientId: '',
      type: '',
    })
  }
  const onPatientChange = (newPatient: Partial<Patient>) => {
    setNewRelatedPatient(newPatient as Patient)
  }

  /*   ------------------------------------------------ */

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
      {showNewRelatedPersonPanel && (
        <AddRelatedPersonPanel
          showCreateRelatedPerson={showCreateRelatedPerson}
          closeNewRelatedPersonPanel={closeNewRelatedPersonPanel}
          relationshipType={relatedPerson.type}
        />
      )}
      <br />
      {showCreateRelatedPersonPanel && (
        <CreateRelatedPersonPanel
          patient={newRelatedPatient}
          onChange={onPatientChange}
          onSave={onSave}
          onCancel={closeCreateRelatedPerson}
          onTypeChange={onTypeChange}
          error={createError}
          isEditable
        />
      )}
    </div>
  )
}

export default RelatedPersonTab
