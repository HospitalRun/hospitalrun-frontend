import { Button, Panel, Checkbox, Alert } from '@hospitalrun/components'
import { startOfDay, subYears, differenceInYears } from 'date-fns'
import { produce } from 'immer'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { generate } from 'shortid'

import DatePickerWithLabelFormGroup from '../components/input/DatePickerWithLabelFormGroup'
import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import Address from '../model/Address'
import Email from '../model/Email'
import Patient from '../model/Patient'
import PhoneNumber from '../model/PhoneNumber'
import { addPhoneNumber, addEmail, addAddress } from './patient-slice'

interface Props {
  patient: Patient
  isEditable?: boolean
  onFieldChange?: (key: string, value: string | boolean) => void
  error?: any
}

const GeneralInformation = (props: Props) => {
  const { t } = useTranslation()
  const { patient, isEditable, onFieldChange, error } = props
  const dispatch = useDispatch()

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    {
      id: generate(),
      phoneNumber: '',
      type: '',
    },
  ])

  const [emails, setEmails] = useState<Email[]>([
    {
      id: generate(),
      email: '',
      type: '',
    },
  ])

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: generate(),
      address: '',
      type: '',
    },
  ])

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
              isInvalid={error?.prefix}
              feedback={t(error?.prefix)}
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
              isInvalid={error?.familyName}
              feedback={t(error?.familyName)}
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
              isInvalid={error?.suffix}
              feedback={t(error?.suffix)}
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
                isInvalid={error?.dateOfBirth}
                maxDate={new Date(Date.now().valueOf())}
                feedback={t(error?.dateOfBirth)}
                onChange={(date: Date) => {
                  onDateOfBirthChange(date)
                }}
              />
            )}
          </div>
          <div className="col">
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
              isInvalid={error?.preferredLanguage}
              feedback={t(error?.preferredLanguage)}
            />
          </div>
        </div>
      </Panel>
      <br />
      <Panel title={t('patient.contactInformation')} color="primary" collapsible>
        <Panel title={t('patient.phoneNumber.panel')} color="primary" collapsible>
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>{t('patient.phoneNumber.type')}</th>
                <th>{t('patient.phoneNumber.phoneNumber')}</th>
              </tr>
            </thead>
            <tbody>
              {patient.id &&
                patient.phoneNumbers &&
                patient.phoneNumbers.map((a: PhoneNumber, index: number) => (
                  <tr key={a.id}>
                    <td>
                      <SelectWithLabelFormGroup
                        name="permanentPhoneNumberType"
                        label={t('patient.phoneNumber.type')}
                        value={a.type}
                        isEditable={isEditable}
                        options={[
                          { label: t('patient.phoneNumber.types.home'), value: 'home' },
                          { label: t('patient.phoneNumber.types.work'), value: 'work' },
                          { label: t('patient.phoneNumber.types.temporary'), value: 'temporary' },
                          { label: t('patient.phoneNumber.types.old'), value: 'old' },
                          { label: t('patient.phoneNumber.types.mobile'), value: 'mobile' },
                        ]}
                        onChange={(event) => {
                          const type = event.target.value
                          setPhoneNumbers((currentPhoneNumber) =>
                            produce(currentPhoneNumber, (v) => {
                              v[index].type = type
                            }),
                          )
                        }}
                      />
                    </td>
                    <td>
                      <TextInputWithLabelFormGroup
                        name="permanentPhoneNumber"
                        isRequired
                        label={t('patient.phoneNumber.phoneNumber')}
                        isEditable={isEditable}
                        placeholder="PhoneNumber"
                        value={a.phoneNumber}
                        onChange={(event) => {
                          const phoneNumber = event.target.value
                          setPhoneNumbers((currentPhoneNumber) =>
                            produce(currentPhoneNumber, (v) => {
                              v[index].phoneNumber = phoneNumber
                            }),
                          )
                        }}
                        feedback={t(error?.phoneNumber)}
                        isInvalid={!!error?.phoneNumber}
                        type="tel"
                      />
                    </td>
                  </tr>
                ))}
              {phoneNumbers?.map(
                (p: PhoneNumber, index: number) =>
                  isEditable && (
                    <tr key={p.id}>
                      <td>
                        <SelectWithLabelFormGroup
                          name="temporaryPhoneNumberType"
                          label={t('patient.phoneNumber.type')}
                          value={p.type}
                          isEditable={isEditable}
                          options={[
                            { label: t('patient.phoneNumber.types.home'), value: 'home' },
                            { label: t('patient.phoneNumber.types.work'), value: 'work' },
                            { label: t('patient.phoneNumber.types.temporary'), value: 'temporary' },
                            { label: t('patient.phoneNumber.types.old'), value: 'old' },
                            { label: t('patient.phoneNumber.types.mobile'), value: 'mobile' },
                          ]}
                          onChange={(event) => {
                            const type = event.target.value
                            setPhoneNumbers((currentPhoneNumber) =>
                              produce(currentPhoneNumber, (v) => {
                                v[index].type = type
                              }),
                            )
                          }}
                        />
                      </td>
                      <td>
                        <TextInputWithLabelFormGroup
                          name="temporaryPhoneNumber"
                          isRequired
                          label={t('patient.phoneNumber.phoneNumber')}
                          isEditable={isEditable}
                          placeholder="PhoneNumber"
                          value={p.phoneNumber}
                          onChange={(event) => {
                            const phoneNumber = event.target.value
                            setPhoneNumbers((currentPhoneNumber) =>
                              produce(currentPhoneNumber, (v) => {
                                v[index].phoneNumber = phoneNumber
                              }),
                            )
                          }}
                          feedback={t(error?.phoneNumber)}
                          isInvalid={!!error?.phoneNumber}
                          type="tel"
                        />
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <div className="addButtonWrapper">
            {isEditable && (
              <Button
                outlined
                className="addButton"
                color="success"
                icon="add"
                iconLocation="left"
                onClick={() => {
                  if (patient.phoneNumbers) {
                    if (patient.id) {
                      dispatch(
                        addPhoneNumber(
                          patient.id,
                          phoneNumbers[phoneNumbers.length - 1] as PhoneNumber,
                        ),
                      )
                    } else {
                      patient.phoneNumbers = patient.phoneNumbers.concat(
                        phoneNumbers[phoneNumbers.length - 1],
                      )
                    }
                  } else {
                    patient.phoneNumbers = phoneNumbers
                  }
                  setPhoneNumbers([
                    ...phoneNumbers,
                    {
                      id: generate(),
                      phoneNumber: '',
                      type: '',
                    },
                  ])
                }}
              >
                {t('patient.phoneNumber.addPhoneNumber')}
              </Button>
            )}
          </div>
        </Panel>

        <br />

        <Panel title={t('patient.email.panel')} color="primary" collapsible>
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>{t('patient.email.type')}</th>
                <th>{t('patient.email.email')}</th>
              </tr>
            </thead>
            <tbody>
              {patient.id &&
                patient.emails &&
                patient.emails.map((a: Email, index: number) => (
                  <tr key={a.id}>
                    <td>
                      <SelectWithLabelFormGroup
                        name="permanentEmailType"
                        label={t('patient.email.type')}
                        value={a.type}
                        isEditable={isEditable}
                        options={[
                          { label: t('patient.email.types.home'), value: 'home' },
                          { label: t('patient.email.types.work'), value: 'work' },
                          { label: t('patient.email.types.temporary'), value: 'temporary' },
                          { label: t('patient.email.types.old'), value: 'old' },
                          { label: t('patient.email.types.mobile'), value: 'mobile' },
                        ]}
                        onChange={(event) => {
                          const type = event.target.value
                          setEmails((currentEmail) =>
                            produce(currentEmail, (v) => {
                              v[index].type = type
                            }),
                          )
                        }}
                      />
                    </td>
                    <td>
                      <TextInputWithLabelFormGroup
                        name="permanentEmail"
                        label={t('patient.email.email')}
                        isEditable={isEditable}
                        placeholder="Email"
                        value={a.email}
                        onChange={(event) => {
                          const email = event.target.value
                          setEmails((currentEmail) =>
                            produce(currentEmail, (v) => {
                              v[index].email = email
                            }),
                          )
                        }}
                        type="email"
                        feedback={t(error?.email)}
                        isInvalid={!!error?.email}
                      />
                    </td>
                  </tr>
                ))}
              {emails?.map(
                (p: Email, index: number) =>
                  isEditable && (
                    <tr key={p.id}>
                      <td>
                        <SelectWithLabelFormGroup
                          name="temporaryEmailType"
                          label={t('patient.email.type')}
                          value={p.type}
                          isEditable={isEditable}
                          options={[
                            { label: t('patient.email.types.home'), value: 'home' },
                            { label: t('patient.email.types.work'), value: 'work' },
                            { label: t('patient.email.types.temporary'), value: 'temporary' },
                            { label: t('patient.email.types.old'), value: 'old' },
                            { label: t('patient.email.types.mobile'), value: 'mobile' },
                          ]}
                          onChange={(event) => {
                            const type = event.target.value
                            setEmails((currentEmail) =>
                              produce(currentEmail, (v) => {
                                v[index].type = type
                              }),
                            )
                          }}
                        />
                      </td>
                      <td>
                        <TextInputWithLabelFormGroup
                          name="temporaryEmail"
                          label={t('patient.email.email')}
                          isEditable={isEditable}
                          placeholder="Email"
                          value={p.email}
                          onChange={(event) => {
                            const email = event.target.value
                            setEmails((currentEmail) =>
                              produce(currentEmail, (v) => {
                                v[index].email = email
                              }),
                            )
                          }}
                          type="email"
                          feedback={t(error?.email)}
                          isInvalid={!!error?.email}
                        />
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <div className="addButtonWrapper">
            {isEditable && (
              <Button
                outlined
                className="addButton"
                color="success"
                icon="add"
                iconLocation="left"
                onClick={() => {
                  if (patient.emails) {
                    if (patient.id) {
                      dispatch(addEmail(patient.id, emails[emails.length - 1] as Email))
                    } else {
                      patient.emails = patient.emails.concat(emails[emails.length - 1])
                    }
                  } else if (patient.id) {
                    dispatch(addEmail(patient.id, emails[emails.length - 1] as Email))
                  } else {
                    patient.emails = emails
                  }
                  setEmails([
                    ...emails,
                    {
                      id: generate(),
                      email: '',
                      type: '',
                    },
                  ])
                }}
              >
                {t('patient.email.addEmail')}
              </Button>
            )}
          </div>
        </Panel>

        <br />

        <Panel title={t('patient.address.panel')} color="primary" collapsible>
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>{t('patient.address.type')}</th>
                <th>{t('patient.address.address')}</th>
              </tr>
            </thead>
            <tbody>
              {patient.id &&
                patient.addresses &&
                patient.addresses.map((a: Address, index: number) => (
                  <tr key={a.id}>
                    <td>
                      <SelectWithLabelFormGroup
                        name="permanentAddressType"
                        label={t('patient.address.type')}
                        value={a.type}
                        isEditable={isEditable}
                        options={[
                          { label: t('patient.address.types.home'), value: 'home' },
                          { label: t('patient.address.types.work'), value: 'work' },
                          { label: t('patient.address.types.temporary'), value: 'temporary' },
                          { label: t('patient.address.types.old'), value: 'old' },
                          { label: t('patient.address.types.billing'), value: 'billing' },
                        ]}
                        onChange={(event) => {
                          const type = event.target.value
                          setAddresses((currentAddress) =>
                            produce(currentAddress, (v) => {
                              v[index].type = type
                            }),
                          )
                        }}
                      />
                    </td>
                    <td>
                      <TextFieldWithLabelFormGroup
                        name="permanentAddress"
                        label={t('patient.address.address')}
                        isEditable={isEditable}
                        placeholder="Address"
                        value={a.address}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const address = event.target.value
                          setAddresses((currentAddress) =>
                            produce(currentAddress, (v) => {
                              v[index].address = address
                            }),
                          )
                        }}
                      />
                    </td>
                  </tr>
                ))}
              {addresses?.map(
                (p: Address, index: number) =>
                  isEditable && (
                    <tr key={p.id}>
                      <td>
                        <SelectWithLabelFormGroup
                          name="temporaryAddressType"
                          label={t('patient.address.type')}
                          value={p.type}
                          isEditable={isEditable}
                          options={[
                            { label: t('patient.address.types.home'), value: 'home' },
                            { label: t('patient.address.types.work'), value: 'work' },
                            { label: t('patient.address.types.temporary'), value: 'temporary' },
                            { label: t('patient.address.types.old'), value: 'old' },
                            { label: t('patient.address.types.billing'), value: 'billing' },
                          ]}
                          onChange={(event) => {
                            const type = event.target.value
                            setAddresses((currentAddress) =>
                              produce(currentAddress, (v) => {
                                v[index].type = type
                              }),
                            )
                          }}
                        />
                      </td>
                      <td>
                        <TextFieldWithLabelFormGroup
                          name="temporaryAddress"
                          label={t('patient.address.address')}
                          isEditable={isEditable}
                          placeholder="Address"
                          value={p.address}
                          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            const address = event.target.value
                            setAddresses((currentAddress) =>
                              produce(currentAddress, (v) => {
                                v[index].address = address
                              }),
                            )
                          }}
                        />
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <div className="addButtonWrapper">
            {isEditable && (
              <Button
                outlined
                className="addButton"
                color="success"
                icon="add"
                iconLocation="left"
                onClick={() => {
                  if (patient.addresses) {
                    if (patient.id) {
                      dispatch(addAddress(patient.id, addresses[addresses.length - 1] as Address))
                    } else {
                      patient.addresses = patient.addresses.concat(addresses[addresses.length - 1])
                    }
                  } else if (patient.id) {
                    dispatch(addAddress(patient.id, addresses[addresses.length - 1] as Address))
                  } else {
                    patient.addresses = addresses
                  }
                  setAddresses([
                    ...addresses,
                    {
                      id: generate(),
                      address: '',
                      type: '',
                    },
                  ])
                }}
              >
                {t('patient.address.addAddress')}
              </Button>
            )}
          </div>
        </Panel>
      </Panel>
    </div>
  )
}

export default GeneralInformation
