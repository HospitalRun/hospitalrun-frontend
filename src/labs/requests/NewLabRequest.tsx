import { Typeahead, Label, Button, Alert, Toast } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import useRequestLab from '../hooks/useRequestLab'
import { LabError } from '../utils/validate-lab'

const NewLabRequest = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const { user } = useSelector((state: RootState) => state.user)
  const [mutate] = useRequestLab()
  const [newNote, setNewNote] = useState('')
  const [error, setError] = useState<LabError | undefined>(undefined)
  const updateTitle = useUpdateTitle()
  updateTitle(t('labs.requests.new'))

  const [newLabRequest, setNewLabRequest] = useState({
    patient: '',
    type: '',
    status: 'requested',
    requestedBy: user?.id || '',
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
      patient: patient.id,
      fullName: patient.fullName,
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
    setNewNote(notes)
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      notes: [notes],
    }))
  }

  const onSave = async () => {
    try {
      const newLab = await mutate(newLabRequest as Lab)
      history.push(`/labs/${newLab?.id}`)
      Toast(
        'success',
        t('states.success'),
        `${t('lab.successfullyCreated')} ${newLab?.type} ${newLab?.patient}`,
      )
      setError(undefined)
    } catch (e) {
      setError(e)
    }
  }

  const onCancel = () => {
    history.push('/labs')
  }

  return (
    <>
      {error && <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />}
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
            isInvalid={!!error?.patient}
            feedback={t(error?.patient as string)}
          />
        </div>
        <TextInputWithLabelFormGroup
          name="labType"
          label={t('labs.lab.type')}
          isRequired
          isEditable
          isInvalid={!!error?.type}
          feedback={t(error?.type as string)}
          value={newLabRequest.type}
          onChange={onLabTypeChange}
        />
        <div className="form-group">
          <TextFieldWithLabelFormGroup
            name="labNotes"
            label={t('labs.lab.notes')}
            isEditable
            value={newNote}
            onChange={onNoteChange}
          />
        </div>
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('labs.requests.save')}
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
