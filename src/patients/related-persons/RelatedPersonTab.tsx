import React, { useState, useEffect } from 'react'
import { Button, Alert, Spinner, Toast } from '@hospitalrun/components'
import AddRelatedPersonModal from 'patients/related-persons/AddRelatedPersonModal'
import RelatedPerson from 'model/RelatedPerson'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import Patient from 'model/Patient'
import { addRelatedPerson, removeRelatedPerson } from 'patients/patient-slice'
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

  const onRelatedPersonClick = (id: string) => {
    navigateTo(`/patients/${id}`)
  }
  const closeNewRelatedPersonModal = () => {
    setShowRelatedPersonModal(false)
  }

  const onAddRelatedPersonSuccess = () => {
    Toast('success', t('states.success'), t('patients.successfullyAddedRelatedPerson'), 'top-left')
  }

  const onRelatedPersonSave = (relatedPerson: RelatedPerson) => {
    dispatch(addRelatedPerson(patient.id, relatedPerson, onAddRelatedPersonSuccess))
    closeNewRelatedPersonModal()
  }

  const onRelatedPersonDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    relatedPerson: Patient,
  ) => {
    event.stopPropagation()
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
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>{t('patient.givenName')}</th>
                    <th>{t('patient.familyName')}</th>
                    <th>{t('patient.relatedPersons.relationshipType')}</th>
                    <th>{t('actions.label')}</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedPersons.map((r) => (
                    <tr key={r.id} onClick={() => onRelatedPersonClick(r.id)}>
                      <td>{r.givenName}</td>
                      <td>{r.familyName}</td>
                      <td>{r.type}</td>
                      <td>
                        <Button
                          icon="remove"
                          color="danger"
                          onClick={(e) => onRelatedPersonDelete(e, r)}
                        >
                          {t('actions.delete')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        onSave={onRelatedPersonSave}
      />
    </div>
  )
}

export default RelatedPersonTab
