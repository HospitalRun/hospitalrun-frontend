import React, { useState, useEffect } from 'react'
import { Modal, Alert } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import Allergy from 'model/Allergy'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'

interface NewAllergyModalProps {
  show: boolean
  onCloseButtonClick: () => void
  onSave: (allergy: Allergy) => void
}

const NewAllergyModal = (props: NewAllergyModalProps) => {
  const { show, onCloseButtonClick, onSave } = props
  const [allergy, setAllergy] = useState({ name: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    setErrorMessage('')
    setAllergy({ name: '' })
  }, [show])

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setAllergy((prevAllergy) => ({ ...prevAllergy, name }))
  }

  const onSaveButtonClick = () => {
    let newErrorMessage = ''
    if (!allergy.name) {
      newErrorMessage += `${t('patient.allergies.error.nameRequired')} `
    }

    if (newErrorMessage) {
      setErrorMessage(newErrorMessage.trim())
      return
    }

    onSave(allergy as Allergy)
  }

  const onClose = () => {
    onCloseButtonClick()
  }

  const body = (
    <>
      {errorMessage && <Alert color="danger" title={t('states.error')} message={errorMessage} />}
      <form>
        <TextInputWithLabelFormGroup
          name="name"
          label="Name"
          isEditable
          placeholder="Allergy"
          value={allergy.name}
          onChange={onNameChange}
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
