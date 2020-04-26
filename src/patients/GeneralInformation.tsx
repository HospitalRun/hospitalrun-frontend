import React from 'react'
import { Panel, Checkbox, Alert } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import { startOfDay, subYears, differenceInYears } from 'date-fns'

import Patient from '../model/Patient'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import DatePickerWithLabelFormGroup from '../components/input/DatePickerWithLabelFormGroup'

interface Props {
  patient: Patient
  isEditable?: boolean
  onFieldChange?: (key: string, value: string | boolean) => void
  error?: any
}

const GeneralInformation = (props: Props) => {
  const { t } = useTranslation()
  const { patient, isEditable, onFieldChange, error } = props

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, event.target.value)

  const onDateOfBirthChange = (date: Date) =>
    onFieldChange && onFieldChange('dateOfBirth', date.toISOString())

  const onInputElementChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, event.target.value)

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) =>
    onFieldChange && onFieldChange(fieldName, event.target.checked)

  const onApproximateAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let approximateAgeNumber
    if (Number.isNaN(parseFloat(event.target.value))) {
      approximateAgeNumber = 0
    } else {
      approximateAgeNumber = parseFloat(event.target.value)
    }

    const approximateDateOfBirth = subYears(new Date(Date.now()), approximateAgeNumber)
    if (onFieldChange) {
      onFieldChange('dateOfBirth', startOfDay(approximateDateOfBirth).toISOString())
    }
  }

  return (
    <div>
      <Panel title={t('patient.basicInformation')} color="primary" collapsible>
        {error?.message && <Alert className="alert" color="danger" message={t(error?.message)} />}
        <div className="row">
          <div className="col-md-2">
            <TextInputWithLabelFormGroup
              label={t('patient.prefix')}
              name="prefix"
              value={patient.prefix}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'prefix')
              }}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup
              label={t('patient.givenName')}
              name="givenName"
              value={patient.givenName}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'givenName')
              }}
              isRequired
              isInvalid={error?.givenName}
              feedback={t(error?.givenName)}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup
              label={t('patient.familyName')}
              name="familyName"
              value={patient.familyName}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'familyName')
              }}
            />
          </div>
          <div className="col-md-2">
            <TextInputWithLabelFormGroup
              label={t('patient.suffix')}
              name="suffix"
              value={patient.suffix}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'suffix')
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <SelectWithLabelFormGroup
              name="sex"
              label={t('patient.sex')}
              value={patient.sex}
              isEditable={isEditable}
              options={[
                { label: t('sex.male'), value: 'male' },
                { label: t('sex.female'), value: 'female' },
                { label: t('sex.other'), value: 'other' },
                { label: t('sex.unknown'), value: 'unknown' },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                onSelectChange(event, 'sex')
              }}
            />
          </div>
          <div className="col">
            <SelectWithLabelFormGroup
              name="type"
              label={t('patient.type')}
              value={patient.type}
              isEditable={isEditable}
              options={[
                { label: t('patient.types.charity'), value: 'charity' },
                { label: t('patient.types.private'), value: 'private' },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                onSelectChange(event, 'type')
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            {patient.isApproximateDateOfBirth ? (
              <TextInputWithLabelFormGroup
                label={t('patient.approximateAge')}
                name="approximateAge"
                type="number"
                value={`${differenceInYears(new Date(Date.now()), new Date(patient.dateOfBirth))}`}
                isEditable={isEditable}
                onChange={onApproximateAgeChange}
              />
            ) : (
              <DatePickerWithLabelFormGroup
                name="dateOfBirth"
                label={t('patient.dateOfBirth')}
                isEditable={isEditable && !patient.isApproximateDateOfBirth}
                value={
                  patient.dateOfBirth && patient.dateOfBirth.length > 0
                    ? new Date(patient.dateOfBirth)
                    : undefined
                }
                isInvalid={error?.dateOfBirth}
                maxDate={new Date(Date.now().valueOf())}
                feedback={t(error?.dateOfBirth)}
                onChange={(date: Date) => {
                  onDateOfBirthChange(date)
                }}
              />
            )}
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <Checkbox
                label={t('patient.unknownDateOfBirth')}
                name="unknown"
                disabled={!isEditable}
                onChange={(event) => onCheckboxChange(event, 'isApproximateDateOfBirth')}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.occupation')}
              name="occupation"
              value={patient.occupation}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'occupation')
              }}
            />
          </div>
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.preferredLanguage')}
              name="preferredLanguage"
              value={patient.preferredLanguage}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'preferredLanguage')
              }}
            />
          </div>
        </div>
      </Panel>
      <br />
      <Panel title={t('patient.contactInformation')} color="primary" collapsible>
        <div className="row">
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.phoneNumber')}
              name="phoneNumber"
              value={patient.phoneNumber}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'phoneNumber')
              }}
              type="tel"
            />
          </div>
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.email')}
              placeholder="email@email.com"
              name="email"
              value={patient.email}
              isEditable={isEditable}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onInputElementChange(event, 'email')
              }}
              type="email"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextFieldWithLabelFormGroup
              label={t('patient.address')}
              name="address"
              value={patient.address}
              isEditable={isEditable}
              onChange={
                (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange && onFieldChange('address', event.currentTarget.value)
                // eslint-disable-next-line react/jsx-curly-newline
              }
            />
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default GeneralInformation
