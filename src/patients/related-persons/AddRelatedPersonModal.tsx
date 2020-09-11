import { Modal, Alert, Typeahead, Label } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState } from 'react'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import useAddPatientRelatedPerson from '../hooks/useAddPatientRelatedPerson'
import usePatients from '../hooks/usePatients'
import { RelatedPersonError } from '../util/validate-related-person'

interface Props {
  patientId: string
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
}

const AddRelatedPersonModal = (props: Props) => {
  const { t } = useTranslator()

  const { patientId, show, toggle, onCloseButtonClick } = props
  const [relatedPerson, setRelatedPerson] = useState({
    patientId: '',
    type: '',
  })

  const [patientQuery, setPatientQuery] = useState<string>('')

  const { data, status } = usePatients({ queryString: patientQuery })
  let patients = [] as Patient[]
  if (data !== undefined && status !== 'loading') {
    patients = data.patients.filter((p: Patient) => p.id !== patientId)
  }

  const [mutate] = useAddPatientRelatedPerson()
  const [relatedPersonError, setRelatedPersonError] = useState<RelatedPersonError | undefined>(
    undefined,
  )

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
    if (p.length > 0) {
      setRelatedPerson({ ...relatedPerson, patientId: p[0].id })
    }
  }

  const onSearch = async (query: string) => {
    setPatientQuery(query)
    return [...patients]
  }

  const onSaveButtonClick = async () => {
    try {
      await mutate({ patientId, relatedPerson })
      onCloseButtonClick()
    } catch (e) {
      setRelatedPersonError(e)
    }
  }

  const formattedDate = (date: string) => (date ? format(new Date(date), 'yyyy-MM-dd') : '')

  const body = (
    <form>
      {relatedPersonError && (
        <Alert
          color="danger"
          title={t('states.error')}
          message={t('patient.relatedPersons.error.unableToAddRelatedPerson')}
        />
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
              isInvalid={!!relatedPersonError?.relatedPersonError}
              onSearch={onSearch}
              renderMenuItemChildren={(p: Patient) => (
                <div>{`${p.fullName} - ${formattedDate(p.dateOfBirth)} (${p.code})`}</div>
              )}
            />
            {relatedPersonError?.relatedPersonError && (
              <div className="text-left ml-3 mt-1 text-small text-danger invalid-feedback d-block related-person-feedback">
                {t(relatedPersonError?.relatedPersonError)}
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
            isInvalid={!!relatedPersonError?.relationshipTypeError}
            feedback={t(relatedPersonError?.relationshipTypeError)}
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
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddRelatedPersonModal
