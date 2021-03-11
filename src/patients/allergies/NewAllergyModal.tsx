import { Modal, Alert } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import useAddAllergy from '../hooks/useAddAllergy'
import { AllergyError } from '../util/validate-allergy'

interface NewAllergyModalProps {
  patientId: string
  show: boolean
  onCloseButtonClick: () => void
}

const NewAllergyModal = (props: NewAllergyModalProps) => {
  const { show, onCloseButtonClick, patientId } = props
  const { t } = useTranslator()
  const [mutate] = useAddAllergy()

  const [allergy, setAllergy] = useState({ name: '' })
  const [allergyError, setAllergyError] = useState<AllergyError | undefined>(undefined)

  useEffect(() => {
    setAllergy({ name: '' })
  }, [show])

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setAllergy((prevAllergy) => ({ ...prevAllergy, name }))
  }

  const onSaveButtonClick = async () => {
    try {
      await mutate({ patientId, allergy })
      onCloseButtonClick()
    } catch (e) {
      setAllergyError(e)
    }
  }

  const onClose = () => {
    onCloseButtonClick()
  }

  const body = (
    <>
      {allergyError && (
        <Alert
          color="danger"
          title={t('states.error')}
          message={t('patient.allergies.error.unableToAdd')}
        />
      )}
      <form>
        <TextInputWithLabelFormGroup
          name="name"
          isRequired
          label={t('patient.allergies.allergyName')}
          isEditable
          placeholder={t('patient.allergies.allergyName')}
          value={allergy.name}
          onChange={onNameChange}
          feedback={t(allergyError?.nameError || '')}
          isInvalid={!!allergyError?.nameError}
        />
      </form>
    </>
  )

  return (
    <Modal
      show={show}
      toggle={onClose}
      title={t('patient.allergies.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onClose,
      }}
      successButton={{
        children: t('patient.allergies.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default NewAllergyModal
