import { Button, Panel, Alert } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { generate } from 'shortid'
import validator from 'validator'

import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import Email from '../../model/Email'
import Patient from '../../model/Patient'
import { addEmptyEmail } from '../patient-slice'

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

const Emails = (props: Props) => {
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

  const emailsLookGood = () => {
    if (patient.emails) {
      for (let i = 0; i < patient.emails.length; i += 1) {
        if (!validator.isEmail(patient.emails[i].email)) {
          return false
        }
      }
    }
    return true
  }

  const onAddButtonClick = () => {
    if (patient.emails) {
      if (patient.id) {
        dispatch(
          addEmptyEmail(
            patient.id,
            {
              id: generate(),
              email: '',
              type: '',
            } as Email,
            patient.phoneNumbers,
            patient.emails,
            patient.addresses,
          ),
        )
      } else {
        addEmptyEntry('emails')
      }
    } else if (patient.id) {
      dispatch(
        addEmptyEmail(
          patient.id,
          {
            id: generate(),
            email: '',
            type: '',
          } as Email,
          patient.phoneNumbers,
          patient.emails,
          patient.addresses,
        ),
      )
    } else if (!patient.id && !patient.emails) {
      addEmptyEntry('emails')
    }
  }

  return (
    <div>
      <Panel title={t('patient.email.panel')} color="primary" collapsible>
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('patient.email.type')}</th>
              <th>{t('patient.email.email')}</th>
            </tr>
          </thead>
          <tbody>
            {patient.emails &&
              patient.emails.map((a: Email, index: number) => {
                const errorBool = error && error.emails && error.emails[index]
                return (
                  <tr key={a.id}>
                    <td>
                      <SelectWithLabelFormGroup
                        name="permanentEmailType"
                        label={t('patient.email.type')}
                        value={patient.emails[index].type}
                        isEditable={isEditable}
                        options={[
                          { label: t('patient.email.types.home'), value: 'home' },
                          { label: t('patient.email.types.work'), value: 'work' },
                          { label: t('patient.email.types.temporary'), value: 'temporary' },
                          { label: t('patient.email.types.old'), value: 'old' },
                          { label: t('patient.email.types.mobile'), value: 'mobile' },
                        ]}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                          onObjectElementChange(index, event.target.value, 'emails', 'type')
                        }}
                      />
                    </td>
                    <td>
                      <TextInputWithLabelFormGroup
                        name="permanentEmail"
                        isRequired
                        label={t('patient.email.email')}
                        isEditable={isEditable}
                        placeholder="Email"
                        value={patient.emails[index].email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          onObjectElementChange(index, event.target.value, 'emails', false)
                        }}
                        feedback={t(errorBool)}
                        isInvalid={!!errorBool}
                        type="email"
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {(!patient.emails || patient.emails.length === 0) && isEditable && (
          <Alert
            color="warning"
            title={t('patient.email.alert.title')}
            message={t('patient.email.alert.message')}
          />
        )}
        <div className="addButtonWrapper">
          {isEditable && emailsLookGood() ? (
            <Button
              outlined
              className="addButton"
              color="success"
              icon="add"
              iconLocation="left"
              onClick={onAddButtonClick}
            >
              {t('patient.email.addEmail')}
            </Button>
          ) : (
            <Button color="warning" disabled>
              {t('patient.email.disabledEmail')}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default Emails
