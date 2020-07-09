import { Panel, Checkbox, Alert } from '@hospitalrun/components'
import { startOfDay, subYears, differenceInYears } from 'date-fns'
import React, { ReactElement } from 'react'

import DatePickerWithLabelFormGroup from '../shared/components/input/DatePickerWithLabelFormGroup'
import SelectWithLabelFormGroup, {
  Option,
} from '../shared/components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../shared/hooks/useTranslator'
import { ContactInfoPiece } from '../shared/model/ContactInformation'
import Patient from '../shared/model/Patient'
import ContactInfo from './ContactInfo'

interface Error {
  message?: string
  prefix?: string
  givenName?: string
  familyName?: string
  suffix?: string
  dateOfBirth?: string
  preferredLanguage?: string
  phoneNumbers?: (string | undefined)[]
  emails?: (string | undefined)[]
}

interface Props {
  patient: Patient
  isEditable?: boolean
  onChange?: (newPatient: Partial<Patient>) => void
  error?: Error
}

const GeneralInformation = (props: Props): ReactElement => {
  const { t } = useTranslator()
  const { patient, isEditable, onChange, error } = props

  const onFieldChange = (name: string, value: string | boolean | ContactInfoPiece[]) => {
    if (onChange) {
      const newPatient = {
        ...patient,
        [name]: value,
      }
      onChange(newPatient)
    }
  }

  const guessDateOfBirthFromApproximateAge = (value: string) => {
    const age = Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value)
    const dateOfBirth = subYears(new Date(Date.now()), age)
    return startOfDay(dateOfBirth).toISOString()
  }

  const onApproximateAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    onFieldChange('dateOfBirth', guessDateOfBirthFromApproximateAge(value))
  }

  const onUnknownDateOfBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget
    onFieldChange('isApproximateDateOfBirth', checked)
  }

  const sexOptions: Option[] = [
    { label: t('sex.male'), value: 'male' },
    { label: t('sex.female'), value: 'female' },
    { label: t('sex.other'), value: 'other' },
    { label: t('sex.unknown'), value: 'unknown' },
  ]

  const typeOptions: Option[] = [
    { label: t('patient.types.charity'), value: 'charity' },
    { label: t('patient.types.private'), value: 'private' },
  ]

  const bloodTypeOptions: Option[] = [
    { label: t('bloodType.apositive'), value: 'A+' },
    { label: t('bloodType.anegative'), value: 'A-' },
    { label: t('bloodType.abpositive'), value: 'AB+' },
    { label: t('bloodType.abnegative'), value: 'AB-' },
    { label: t('bloodType.bpositive'), value: 'B+' },
    { label: t('bloodType.bnegative'), value: 'B-' },
    { label: t('bloodType.opositive'), value: 'O+' },
    { label: t('bloodType.onegative'), value: 'O-' },
    { label: t('bloodType.unknown'), value: 'unknown' },
  ]

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
              onChange={(event) => onFieldChange('prefix', event.currentTarget.value)}
              isInvalid={!!error?.prefix}
              feedback={t(error?.prefix)}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup
              label={t('patient.givenName')}
              name="givenName"
              value={patient.givenName}
              isEditable={isEditable}
              onChange={(event) => onFieldChange('givenName', event.currentTarget.value)}
              isRequired
              isInvalid={!!error?.givenName}
              feedback={t(error?.givenName)}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup
              label={t('patient.familyName')}
              name="familyName"
              value={patient.familyName}
              isEditable={isEditable}
              onChange={(event) => onFieldChange('familyName', event.currentTarget.value)}
              isInvalid={!!error?.familyName}
              feedback={t(error?.familyName)}
            />
          </div>
          <div className="col-md-2">
            <TextInputWithLabelFormGroup
              label={t('patient.suffix')}
              name="suffix"
              value={patient.suffix}
              isEditable={isEditable}
              onChange={(event) => onFieldChange('suffix', event.currentTarget.value)}
              isInvalid={!!error?.suffix}
              feedback={t(error?.suffix)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <SelectWithLabelFormGroup
              name="sex"
              label={t('patient.sex')}
              options={sexOptions}
              defaultSelected={sexOptions.filter(({ value }) => value === patient.sex)}
              onChange={(values) => onFieldChange('sex', values[0])}
              isEditable={isEditable}
            />
          </div>
          <div className="col">
            <SelectWithLabelFormGroup
              name="type"
              label={t('patient.type')}
              options={typeOptions}
              defaultSelected={typeOptions.filter(({ value }) => value === patient.type)}
              onChange={(values) => onFieldChange('type', values[0])}
              isEditable={isEditable}
            />
          </div>
          <div className="col">
            <SelectWithLabelFormGroup
              name="bloodType"
              label={t('patient.bloodType')}
              options={bloodTypeOptions}
              defaultSelected={bloodTypeOptions.filter(({ value }) => value === patient.bloodType)}
              onChange={(values) => onFieldChange('bloodType', values[0])}
              isEditable={isEditable}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
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
                maxDate={new Date(Date.now().valueOf())}
                onChange={(date: Date) => onFieldChange('dateOfBirth', date.toISOString())}
                isInvalid={!!error?.dateOfBirth}
                feedback={t(error?.dateOfBirth)}
              />
            )}
          </div>
          <div className="col">
            <div className="form-group">
              <Checkbox
                label={t('patient.unknownDateOfBirth')}
                name="unknown"
                disabled={!isEditable}
                onChange={onUnknownDateOfBirthChange}
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
              onChange={(event) => onFieldChange('occupation', event.currentTarget.value)}
            />
          </div>
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.preferredLanguage')}
              name="preferredLanguage"
              value={patient.preferredLanguage}
              isEditable={isEditable}
              onChange={(event) => onFieldChange('preferredLanguage', event.currentTarget.value)}
              isInvalid={!!error?.preferredLanguage}
              feedback={t(error?.preferredLanguage)}
            />
          </div>
        </div>
      </Panel>
      <br />
      <Panel title={t('patient.contactInformation')} color="primary" collapsible>
        <div className="mb-4">
          <Panel title={t('patient.phoneNumber')} color="primary" collapsible>
            <ContactInfo
              component="TextInputWithLabelFormGroup"
              data={patient.phoneNumbers}
              errors={error?.phoneNumbers}
              label="patient.phoneNumber"
              name="phoneNumber"
              isEditable={isEditable}
              onChange={(newPhoneNumbers) => onFieldChange('phoneNumbers', newPhoneNumbers)}
            />
          </Panel>
        </div>
        <div className="mb-4">
          <Panel title={t('patient.email')} color="primary" collapsible>
            <ContactInfo
              component="TextInputWithLabelFormGroup"
              data={patient.emails}
              errors={error?.emails}
              label="patient.email"
              name="email"
              isEditable={isEditable}
              onChange={(newEmails) => onFieldChange('emails', newEmails)}
            />
          </Panel>
        </div>
        <div>
          <Panel title={t('patient.address')} color="primary" collapsible>
            <ContactInfo
              component="TextFieldWithLabelFormGroup"
              data={patient.addresses}
              label="patient.address"
              name="address"
              isEditable={isEditable}
              onChange={(newAddresses) => onFieldChange('addresses', newAddresses)}
            />
          </Panel>
        </div>
      </Panel>
    </div>
  )
}

export default GeneralInformation
