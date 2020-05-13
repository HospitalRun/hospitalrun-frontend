import { Modal, Alert, Typeahead, Label } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import PatientRepository from 'clients/db/PatientRepository'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import Patient from 'model/Patient'
import RelatedPerson from 'model/RelatedPerson'
import { addRelatedPerson } from 'patients/patient-slice'
import { RootState } from 'store'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
}

const AddRelatedPersonModal = (props: Props) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { patient, relatedPersonError } = useSelector((state: RootState) => state.patient)

  const { show, toggle, onCloseButtonClick } = props
  const [relatedPerson, setRelatedPerson] = useState({
    patientId: '',
    type: '',
  })

  const onFieldChange = (key: string, value: string) => {
    setRelatedPerson({
      ...relatedPerson,
      [key]: value,
    })
  }

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    onFieldChange(fieldName, event.target.value)
  }

  const onPatientSelect = (p: Patient[]) => {
    setRelatedPerson({ ...relatedPerson, patientId: p[0].id })
  }

  const body = (
    <form>
      {relatedPersonError?.message && (
        <Alert color="danger" title={t('states.error')} message={t(relatedPersonError?.message)} />
      )}
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <Label text={t('patient.relatedPerson')} htmlFor="relatedPersonTypeAhead" isRequired />
            <Typeahead
              id="relatedPersonTypeAhead"
              searchAccessor="fullName"
              placeholder={t('patient.relatedPerson')}
              onChange={onPatientSelect}
              isInvalid={!!relatedPersonError?.relatedPerson}
              onSearch={async (query: string) => PatientRepository.search(query)}
              renderMenuItemChildren={(p: Patient) => {
                if (patient.id === p.id) {
                  return <div />
                }

                return <div>{`${p.fullName} (${p.code})`}</div>
              }}
            />
            {relatedPersonError?.relatedPerson && (
              <div className="text-left ml-3 mt-1 text-small text-danger invalid-feedback d-block related-person-feedback">
                {t(relatedPersonError?.relatedPerson)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
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
    </form>
  )

  return (
    <Modal
      show={show}
      toggle={toggle}
      title={t('patient.relatedPersons.add')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: t('patient.relatedPersons.add'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: () => {
          dispatch(addRelatedPerson(patient.id, relatedPerson as RelatedPerson))
        },
      }}
    />
  )
}

export default AddRelatedPersonModal
