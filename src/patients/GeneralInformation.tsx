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
        <div>
          {phoneNumbers?.map((p: PhoneNumber, index: number) => (
            <div key={p.id} className="row">
              <div className="col-md-4">
                <SelectWithLabelFormGroup
                  name="phoneNumberType"
                  label={t('patient.phoneNumber.type')}
                  value={p.type}
                  isEditable={isEditable}
                  options={[
                    { label: 'Home', value: 'Home' },
                    { label: 'Work', value: 'Work' },
                    { label: 'Temp', value: 'Temp' },
                    { label: 'Old', value: 'Old' },
                    { label: 'Mobile', value: 'Mobile' },
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
              </div>
              <div className="col-md-6">
                <TextInputWithLabelFormGroup
                  name="phoneNumber"
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
              </div>

              <div className="col-md-2">
                {!patient.id && (
                  <Button
                    outlined
                    className="addButton"
                    color="success"
                    icon="add"
                    iconLocation="left"
                    onClick={() => {
                      if (patient.phoneNumber) {
                        patient.phoneNumber = patient.phoneNumber.concat(phoneNumbers)
                      } else {
                        patient.phoneNumber = phoneNumbers
                      }
                      setPhoneNumbers([
                        {
                          id: generate(),
                          phoneNumber: '',
                          type: '',
                        },
                      ])
                    }}
                  >
                    Add
                  </Button>
                )}
                {patient.id && (
                  <Button
                    outlined
                    className="addButton"
                    color="success"
                    icon="add"
                    iconLocation="left"
                    onClick={() => {
                      dispatch(addPhoneNumber(patient.id, p as PhoneNumber))
                    }}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
          {patient.phoneNumber && (
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Type</th>
                  <th>PhoneNumber</th>
                </tr>
              </thead>
              <tbody>
                {patient.phoneNumber.map((a: PhoneNumber) => (
                  <tr key={a.id}>
                    <td>{a.type}</td>
                    <td>{a.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <br />

          {emails?.map((p: Email, index: number) => (
            <div key={p.id} className="row">
              <div className="col-md-4">
                <SelectWithLabelFormGroup
                  name="emailType"
                  label={t('patient.email.type')}
                  value={p.type}
                  isEditable={isEditable}
                  options={[
                    { label: 'Home', value: 'Home' },
                    { label: 'Work', value: 'Work' },
                    { label: 'Temp', value: 'Temp' },
                    { label: 'Old', value: 'Old' },
                    { label: 'Mobile', value: 'Mobile' },
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
              </div>
              <div className="col-md-6">
                <TextInputWithLabelFormGroup
                  name="email"
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
              </div>

              <div className="col-md-2">
                {!patient.id && (
                  <Button
                    outlined
                    className="addButton"
                    color="success"
                    icon="add"
                    iconLocation="left"
                    onClick={() => {
                      if (patient.email) {
                        patient.email = patient.email.concat(emails)
                      } else {
                        patient.email = emails
                      }
                      setEmails([
                        {
                          id: generate(),
                          email: '',
                          type: '',
                        },
                      ])
                    }}
                  >
                    Add
                  </Button>
                )}
                {patient.id && (
                  <Button
                    outlined
                    className="addButton"
                    color="success"
                    icon="add"
                    iconLocation="left"
                    onClick={() => {
                      dispatch(addEmail(patient.id, p as Email))
                    }}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
          {patient.email && (
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Type</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {patient.email?.map((a: Email) => (
                  <tr key={a.id}>
                    <td>{a.type}</td>
                    <td>{a.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <br />

          {addresses?.map((p: Address, index: number) => (
            <div key={p.id} className="row">
              <div className="col-md-4">
                <SelectWithLabelFormGroup
                  name="addressType"
                  label={t('patient.address.type')}
                  value={p.type}
                  isEditable={isEditable}
                  options={[
                    { label: 'Home', value: 'Home' },
                    { label: 'Work', value: 'Work' },
                    { label: 'Temp', value: 'Temp' },
                    { label: 'Old', value: 'Old' },
                    { label: 'Billing', value: 'Billing' },
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
              </div>
              <div className="col-md-6">
                <TextFieldWithLabelFormGroup
                  name="address"
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
              </div>

              <div className="col-md-2">
                {!patient.id && (
                  <Button
                    outlined
                    className="addButton"
                    color="success"
                    icon="add"
                    iconLocation="left"
                    onClick={() => {
                      if (patient.address) {
                        patient.address = patient.address.concat(addresses)
                      } else {
                        patient.address = addresses
                      }
                      setAddresses([
                        {
                          id: generate(),
                          address: '',
                          type: '',
                        },
                      ])
                    }}
                  >
                    Add
                  </Button>
                )}
                {patient.id && (
                  <Button
                    outlined
                    className="addButton"
                    color="success"
                    icon="add"
                    iconLocation="left"
                    onClick={() => {
                      dispatch(addAddress(patient.id, p as Address))
                    }}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          ))}
          {patient.address && (
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Type</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {patient.address?.map((a: Address) => (
                  <tr key={a.id}>
                    <td>{a.type}</td>
                    <td>{a.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default GeneralInformation
