import { Button, Panel, Alert } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { generate } from 'shortid'
import validator from 'validator'

import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import Patient from '../../model/Patient'
import PhoneNumber from '../../model/PhoneNumber'
import { addEmptyPhoneNumber } from '../patient-slice'

interface Props {
  patient: Patient
  error?: any
  isEditable?: boolean
  addEmptyEntryToPatientArrayField?: (key: string) => void
  onObjectArrayChange?: (
    key: number,
    value: string,
    arrayObject: string | boolean,
    type: string | boolean,
  ) => void
}

const PhoneNumbers = (props: Props) => {
  const {
    patient,
    error,
    isEditable,
    addEmptyEntryToPatientArrayField,
    onObjectArrayChange,
  } = props

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onObjectElementChange = (
    index: number,
    event: string,
    arrayObject: string | boolean,
    type: string | boolean,
  ) => onObjectArrayChange && onObjectArrayChange(index, event, arrayObject, type)

  const addEmptyEntry = (fieldName: string) =>
    addEmptyEntryToPatientArrayField && addEmptyEntryToPatientArrayField(fieldName)

  const phoneNumbersLookGood = () => {
    if (patient.phoneNumbers) {
      for (let i = 0; i < patient.phoneNumbers.length; i += 1) {
        if (!validator.isMobilePhone(patient.phoneNumbers[i].phoneNumber)) {
          return false
        }
      }
    }
    return true
  }

  const onAddButtonClick = () => {
    if (patient.phoneNumbers) {
      if (patient.id) {
        dispatch(
          addEmptyPhoneNumber(
            patient.id,
            {
              id: generate(),
              phoneNumber: '',
              type: '',
            } as PhoneNumber,
            patient.phoneNumbers,
            patient.emails,
            patient.addresses,
          ),
        )
      } else {
        addEmptyEntry('phoneNumbers')
      }
    } else if (patient.id) {
      dispatch(
        addEmptyPhoneNumber(
          patient.id,
          {
            id: generate(),
            phoneNumber: '',
            type: '',
          } as PhoneNumber,
          patient.phoneNumbers,
          patient.emails,
          patient.addresses,
        ),
      )
    } else if (!patient.id && !patient.phoneNumbers) {
      addEmptyEntry('phoneNumbers')
    }
  }

  return (
    <div>
      <Panel title={t('patient.phoneNumber.panel')} color="primary" collapsible>
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('patient.phoneNumber.type')}</th>
              <th>{t('patient.phoneNumber.phoneNumber')}</th>
            </tr>
          </thead>
          <tbody>
            {patient.phoneNumbers &&
              patient.phoneNumbers.map((a: PhoneNumber, index: number) => {
                const errorBool = error && error.phoneNumbers && error.phoneNumbers[index]
                return (
                  <tr key={a.id}>
                    <td>
                      <SelectWithLabelFormGroup
                        name="permanentPhoneNumberType"
                        label={t('patient.phoneNumber.type')}
                        value={patient.phoneNumbers[index].type}
                        isEditable={isEditable}
                        options={[
                          { label: t('patient.phoneNumber.types.home'), value: 'home' },
                          { label: t('patient.phoneNumber.types.work'), value: 'work' },
                          { label: t('patient.phoneNumber.types.temporary'), value: 'temporary' },
                          { label: t('patient.phoneNumber.types.old'), value: 'old' },
                          { label: t('patient.phoneNumber.types.mobile'), value: 'mobile' },
                        ]}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                          onObjectElementChange(index, event.target.value, 'phoneNumbers', 'type')
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
                        value={patient.phoneNumbers[index].phoneNumber}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          onObjectElementChange(index, event.target.value, 'phoneNumbers', false)
                        }}
                        feedback={t(errorBool)}
                        isInvalid={!!errorBool}
                        type="tel"
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {(!patient.phoneNumbers || patient.phoneNumbers.length === 0) && isEditable && (
          <Alert
            color="warning"
            title={t('patient.phoneNumber.alert.title')}
            message={t('patient.phoneNumber.alert.message')}
          />
        )}
        <div className="addButtonWrapper">
          {isEditable && phoneNumbersLookGood() ? (
            <Button
              outlined
              className="addButton"
              color="success"
              icon="add"
              iconLocation="left"
              onClick={onAddButtonClick}
            >
              {t('patient.phoneNumber.addPhoneNumber')}
            </Button>
          ) : (
            <Button color="warning" disabled>
              {t('patient.phoneNumber.disabledPhoneNumber')}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default PhoneNumbers
