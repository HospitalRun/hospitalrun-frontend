import { Panel, Alert, Typeahead, Label, Button } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import RelatedPerson from '../../shared/model/RelatedPerson'
import { RootState } from '../../shared/store'
import { addRelatedPerson, addRelatedPersonError } from '../patient-slice'

interface Props {
  closeNewRelatedPersonPanel(): void
  showCreateRelatedPerson(): void
  relationshipType: string
}

const AddRelatedPersonPanel = (props: Props) => {
  const { closeNewRelatedPersonPanel, showCreateRelatedPerson, relationshipType } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { patient, relatedPersonError } = useSelector((state: RootState) => state.patient)

  const [relatedPerson, setRelatedPerson] = useState({
    patientId: '',
    type: relationshipType,
  })

  const onFieldChange = (key: string, value: string) => {
    setRelatedPerson({
      ...relatedPerson,
      [key]: value,
    })
  }

  useEffect(() => {
    setRelatedPerson({
      ...relatedPerson,
      type: relationshipType,
    })
  }, [relationshipType])

  useEffect(() => {
    if (relatedPersonError?.message) {
      showCreateRelatedPerson()
    }
  }, [relatedPersonError?.message])

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    onFieldChange(fieldName, event.target.value)
  }

  const onPatientSelect = (p: Patient[]) => {
    setRelatedPerson({ ...relatedPerson, patientId: p[0].id })
  }

  const onSearch = async (query: string) => {
    const patients: Patient[] = await PatientRepository.search(query)
    return patients.filter((p: Patient) => p.id !== patient.id)
  }

  const body = (
    <form>
      {relatedPersonError?.message && (
        <Alert color="danger" title={t('states.error')} message={t(relatedPersonError?.message)} />
      )}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <Label text={t('patient.relatedPerson')} htmlFor="relatedPersonTypeAhead" isRequired />
            <Typeahead
              id="relatedPersonTypeAhead"
              searchAccessor="fullName"
              placeholder={t('patient.relatedPerson')}
              onChange={onPatientSelect}
              isInvalid={!!relatedPersonError?.relatedPerson}
              onSearch={onSearch}
              renderMenuItemChildren={(p: Patient) => (
                <div>
                  {`${p.fullName} - ${format(new Date(p.dateOfBirth), 'yyyy-MM-dd')} (${p.code})`}
                </div>
              )}
            />
            {relatedPersonError?.relatedPerson && (
              <div className="text-left ml-3 mt-1 text-small text-danger invalid-feedback d-block related-person-feedback">
                {t(relatedPersonError?.relatedPerson)}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <TextInputWithLabelFormGroup
            name="type"
            label={t('patient.relatedPersons.relationshipType')}
            value={relatedPerson.type}
            isEditable
            isInvalid={!!relatedPersonError?.relationshipType}
            feedback={t(relatedPersonError?.relationshipType || '')}
            isRequired
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onInputElementChange(event, 'type')
            }}
          />
        </div>
      </div>
      <div className="row float-right">
        <div className="btn-group btn-group-lg">
          <Button
            className="btn-save mr-2"
            color="success"
            onClick={() => {
              dispatch(addRelatedPerson(patient.id, relatedPerson as RelatedPerson))
            }}
          >
            {t('actions.save')}
          </Button>
          <Button
            className="btn-cancel mr-3"
            color="danger"
            onClick={() => {
              closeNewRelatedPersonPanel()
              dispatch(addRelatedPersonError({}))
            }}
          >
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </form>
  )

  return <Panel title="Add Related Person">{body}</Panel>
}

export default AddRelatedPersonPanel
