import { Select, Typeahead, Label, Button, Alert, Column, Row } from '@hospitalrun/components'
import { set } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import { SelectOption } from '../../shared/components/input/SelectOption'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Medication from '../../shared/model/Medication'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import { requestMedication } from '../medication-slice'

const NewMedicationRequest = () => {
  const { t } = useTranslator()
  const dispatch = useDispatch()
  const history = useHistory()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('medications.requests.new'))
  })
  const { status, error } = useSelector((state: RootState) => state.medication)

  const [newMedicationRequest, setNewMedicationRequest] = useState(({
    patient: '',
    medication: '',
    notes: '',
    status: '',
    intent: 'order',
    priority: '',
    quantity: { value: ('' as unknown) as number, unit: '' },
  } as unknown) as Medication)

  const statusOptionsNew: SelectOption[] = [
    { label: t('medications.status.draft'), value: 'draft' },
    { label: t('medications.status.active'), value: 'active' },
  ]

  const intentOptions: SelectOption[] = [
    { label: t('medications.intent.proposal'), value: 'proposal' },
    { label: t('medications.intent.plan'), value: 'plan' },
    { label: t('medications.intent.order'), value: 'order' },
    { label: t('medications.intent.originalOrder'), value: 'original order' },
    { label: t('medications.intent.reflexOrder'), value: 'reflex order' },
    { label: t('medications.intent.fillerOrder'), value: 'filler order' },
    { label: t('medications.intent.instanceOrder'), value: 'instance order' },
    { label: t('medications.intent.option'), value: 'option' },
  ]

  const priorityOptions: SelectOption[] = [
    { label: t('medications.priority.routine'), value: 'routine' },
    { label: t('medications.priority.urgent'), value: 'urgent' },
    { label: t('medications.priority.asap'), value: 'asap' },
    { label: t('medications.priority.stat'), value: 'stat' },
  ]

  const breadcrumbs = [
    {
      i18nKey: 'medications.requests.new',
      location: `/medications/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    setNewMedicationRequest((previousNewMedicationRequest) => ({
      ...previousNewMedicationRequest,
      patient: patient.id,
      fullName: patient.fullName as string,
    }))
  }

  const onMedicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const medication = event.currentTarget.value
    setNewMedicationRequest((previousNewMedicationRequest) => ({
      ...previousNewMedicationRequest,
      medication,
    }))
  }

  const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    setNewMedicationRequest((previousNewMedicationRequest) => ({
      ...previousNewMedicationRequest,
      notes,
    }))
  }

  const onFieldChange = (key: string, value: string | boolean) => {
    setNewMedicationRequest((previousNewMedicationRequest) => ({
      ...previousNewMedicationRequest,
      [key]: value,
    }))
  }

  const onTextInputChange = (text: string, path: string | Array<string>) => {
    setNewMedicationRequest((previousNewMedicationRequest) => {
      const medicationRequest = {
        ...previousNewMedicationRequest,
      }

      const propertyPath = typeof path === 'string' ? [path] : path
      set(medicationRequest, propertyPath, text)

      return medicationRequest
    })
  }

  const onSave = async () => {
    const newMedication = newMedicationRequest as Medication
    const onSuccess = (createdMedication: Medication) => {
      history.push(`/medications/${createdMedication.id}`)
    }

    dispatch(requestMedication(newMedication, onSuccess))
  }

  const onCancel = () => {
    history.push('/medications')
  }

  return (
    <>
      {status === 'error' && (
        <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
      )}
      <form aria-label="Medication Request form">
        <div className="form-group patient-typeahead">
          <Label htmlFor="patientTypeahead" isRequired text={t('medications.medication.patient')} />
          <Typeahead
            id="patientTypeahead"
            placeholder={t('medications.medication.patient')}
            onChange={(p: Patient[]) => onPatientChange(p[0])}
            onSearch={async (query: string) => PatientRepository.search(query)}
            searchAccessor="fullName"
            renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
            isInvalid={!!error.patient}
          />
        </div>
        <TextInputWithLabelFormGroup
          name="medication"
          label={t('medications.medication.medication')}
          isRequired
          isEditable
          isInvalid={!!error.medication}
          feedback={t(error.medication as string)}
          value={newMedicationRequest.medication}
          onChange={onMedicationChange}
        />
        <div className="form-group" data-testid="statusSelect">
          <Label text={t('medications.medication.status')} title="status" isRequired />
          <Select
            id="statusSelect"
            options={statusOptionsNew}
            defaultSelected={statusOptionsNew.filter(
              ({ value }) => value === newMedicationRequest.status,
            )}
            onChange={(values) => onFieldChange && onFieldChange('status', values[0])}
            disabled={false}
          />
        </div>
        <div className="form-group" data-testid="intentSelect">
          <Label text={t('medications.medication.intent')} title="intent" isRequired />
          <Select
            id="intentSelect"
            options={intentOptions}
            defaultSelected={intentOptions.filter(
              ({ value }) => value === newMedicationRequest.intent,
            )}
            onChange={(values) => onFieldChange && onFieldChange('intent', values[0])}
            disabled={false}
          />
        </div>
        <div className="form-group" data-testid="prioritySelect">
          <Label text={t('medications.medication.priority')} title="priority" isRequired />
          <Select
            id="prioritySelect"
            options={priorityOptions}
            defaultSelected={priorityOptions.filter(
              ({ value }) => value === newMedicationRequest.priority,
            )}
            onChange={(values) => onFieldChange && onFieldChange('priority', values[0])}
            disabled={false}
          />
        </div>
        <Row>
          <Column md={6}>
            <TextInputWithLabelFormGroup
              name="quantityValue"
              label={`${t('medications.medication.quantity')} | ${t(
                'medications.medication.quantityValue',
              )}`}
              isEditable
              isRequired
              value={(newMedicationRequest.quantity.value as unknown) as string}
              onChange={(event) =>
                onTextInputChange(event.currentTarget.value, ['quantity', 'value'])
              }
              isInvalid={!!error?.quantityValue}
              feedback={t(error?.quantityValue as string)}
            />
          </Column>
          <Column md={6}>
            <TextInputWithLabelFormGroup
              label={`${t('medications.medication.quantity')} | ${t(
                'medications.medication.quantityUnit',
              )}`}
              name="quantityUnit"
              isRequired
              isEditable
              value={newMedicationRequest.quantity.unit}
              onChange={(event) =>
                onTextInputChange(event.currentTarget.value, ['quantity', 'unit'])
              }
              isInvalid={!!error?.quantityUnit}
              feedback={t(error?.quantityUnit as string)}
            />
          </Column>
        </Row>
        <div className="form-group">
          <TextFieldWithLabelFormGroup
            name="medicationNotes"
            label={t('medications.medication.notes')}
            isEditable
            value={newMedicationRequest.notes}
            onChange={onNoteChange}
          />
        </div>
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3 mr-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('medications.requests.new')}
            </Button>
            <Button color="danger" onClick={onCancel}>
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default NewMedicationRequest
