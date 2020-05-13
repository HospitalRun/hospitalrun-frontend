import { Typeahead, Label, Button, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'

import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'
import PatientRepository from 'clients/db/PatientRepository'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import { requestLab } from 'labs/lab-slice'
import Lab from 'model/Lab'
import Patient from 'model/Patient'
import useTitle from 'page-header/useTitle'
import { RootState } from 'store'

const NewLabRequest = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  useTitle(t('labs.requests.new'))
  const { status, error } = useSelector((state: RootState) => state.lab)

  const [newLabRequest, setNewLabRequest] = useState({
    patientId: '',
    type: '',
    notes: '',
    status: 'requested',
  })

  const breadcrumbs = [
    {
      i18nKey: 'labs.requests.new',
      location: `/labs/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      patientId: patient.id,
    }))
  }

  const onLabTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.currentTarget.value
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      type,
    }))
  }

  const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      notes,
    }))
  }

  const onSave = async () => {
    const newLab = newLabRequest as Lab
    const onSuccess = (createdLab: Lab) => {
      history.push(`/labs/${createdLab.id}`)
    }

    dispatch(requestLab(newLab, onSuccess))
  }

  const onCancel = () => {
    history.push('/labs')
  }

  return (
    <>
      {status === 'error' && (
        <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
      )}
      <form>
        <div className="form-group patient-typeahead">
          <Label htmlFor="patientTypeahead" isRequired text={t('labs.lab.patient')} />
          <Typeahead
            id="patientTypeahead"
            placeholder={t('labs.lab.patient')}
            onChange={(p: Patient[]) => onPatientChange(p[0])}
            onSearch={async (query: string) => PatientRepository.search(query)}
            searchAccessor="fullName"
            renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
            isInvalid={!!error.patient}
          />
        </div>
        <TextInputWithLabelFormGroup
          name="labType"
          label={t('labs.lab.type')}
          isRequired
          isEditable
          isInvalid={!!error.type}
          feedback={t(error.type as string)}
          value={newLabRequest.type}
          onChange={onLabTypeChange}
        />
        <div className="form-group">
          <TextFieldWithLabelFormGroup
            name="labNotes"
            label={t('labs.lab.notes')}
            isEditable
            value={newLabRequest.notes}
            onChange={onNoteChange}
          />
        </div>
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('actions.save')}
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

export default NewLabRequest
