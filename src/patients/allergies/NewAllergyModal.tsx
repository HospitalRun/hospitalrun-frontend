import React, { useState, useEffect } from 'react'
import { Modal, Alert } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import Allergy from 'model/Allergy'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { addAllergy } from '../patient-slice'

interface NewAllergyModalProps {
  show: boolean
  onCloseButtonClick: () => void
}

const NewAllergyModal = (props: NewAllergyModalProps) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { allergyError, patient } = useSelector((state: RootState) => state.patient)

  const [allergy, setAllergy] = useState({ name: '' })

  useEffect(() => {
    setAllergy({ name: '' })
  }, [show])

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setAllergy((prevAllergy) => ({ ...prevAllergy, name }))
  }

  const onSaveButtonClick = () => {
    dispatch(addAllergy(patient.id, allergy as Allergy))
  }

  const onClose = () => {
    onCloseButtonClick()
  }

  const body = (
    <>
      {allergyError && (
        <Alert color="danger" title={t('states.error')} message={t(allergyError?.message || '')} />
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
          feedback={t(allergyError?.name || '')}
          isInvalid={!!allergyError?.name}
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
