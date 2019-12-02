import React from 'react'
import { TextInput, Button } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

interface Props {
  isEditable?: boolean
  patient?: { firstName: string; lastName: string }
  onFieldChange: (key: string, value: string) => void
  onSaveButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancelButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PatientForm: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation()
  const handleChange = (event: React.FormEvent<HTMLInputElement>, fieldName: string) => {
    props.onFieldChange(fieldName, event.currentTarget.value)
  }

  const { patient, isEditable, onSaveButtonClick, onCancelButtonClick } = props

  let firstName = ''
  let lastName = ''
  if (patient) {
    firstName = patient.firstName
    lastName = patient.lastName
  }

  return (
    <div>
      <form>
        <div className="row">
          <h3>{t('patient.firstName')}:</h3>
          <TextInput
            value={firstName}
            disabled={!isEditable}
            onChange={(event) => handleChange(event, 'firstName')}
          />
        </div>
        <div className="row">
          <h3>{t('patient.lastName')}:</h3>
          <TextInput
            value={lastName}
            disabled={!isEditable}
            onChange={(event) => handleChange(event, 'lastName')}
          />
        </div>
        {isEditable && (
          <div className="row">
            <Button onClick={onSaveButtonClick}> {t('actions.save')}</Button>
            <Button color="danger" onClick={onCancelButtonClick}>
              {t('actions.cancel')}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

PatientForm.defaultProps = {
  isEditable: true,
  patient: { firstName: '', lastName: '' },
}

export default PatientForm
