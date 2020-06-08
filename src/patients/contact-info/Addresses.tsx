import { Button, Panel, Alert } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { generate } from 'shortid'

import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import Address from '../../model/Address'
import Patient from '../../model/Patient'
import { addEmptyAddress } from '../patient-slice'

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

const Addresses = (props: Props) => {
  const { patient, isEditable, addEmptyEntryToPatientArrayField, onObjectArrayChange } = props

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

  const onAddButtonClick = () => {
    if (patient.addresses) {
      if (patient.id) {
        dispatch(
          addEmptyAddress(
            patient.id,
            {
              id: generate(),
              address: '',
              type: '',
            } as Address,
            patient.phoneNumbers,
            patient.emails,
            patient.addresses,
          ),
        )
      } else {
        addEmptyEntry('addresses')
      }
    } else if (patient.id) {
      dispatch(
        addEmptyAddress(
          patient.id,
          {
            id: generate(),
            address: '',
            type: '',
          } as Address,
          patient.phoneNumbers,
          patient.emails,
          patient.addresses,
        ),
      )
    } else if (!patient.id && !patient.addresses) {
      addEmptyEntry('addresses')
    }
  }

  return (
    <div>
      <Panel title={t('patient.address.panel')} color="primary" collapsible>
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('patient.address.type')}</th>
              <th>{t('patient.address.address')}</th>
            </tr>
          </thead>
          <tbody>
            {patient.addresses &&
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
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        onObjectElementChange(index, event.target.value, 'addresses', 'type')
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
                      onChange={(event) => {
                        onObjectElementChange(index, event.target.value, 'addresses', false)
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!patient.addresses || patient.addresses.length === 0) && isEditable && (
          <Alert
            color="warning"
            title={t('patient.address.alert.title')}
            message={t('patient.address.alert.message')}
          />
        )}
        <div className="addButtonWrapper">
          {isEditable && (
            <Button
              outlined
              className="addButton"
              color="success"
              icon="add"
              iconLocation="left"
              onClick={onAddButtonClick}
            >
              {t('patient.address.addAddress')}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default Addresses
