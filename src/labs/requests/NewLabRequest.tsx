import {
  Select,
  Typeahead,
  Label,
  Button,
  Alert,
  Toast,
  Column,
  Row,
} from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import { SelectOption } from '../../shared/components/input/SelectOption'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Lab from '../../shared/model/Lab'
import Note from '../../shared/model/Note'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import { uuid } from '../../shared/util/uuid'
import useRequestLab from '../hooks/useRequestLab'
import { LabError } from '../utils/validate-lab'

const NewLabRequest = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const { user } = useSelector((state: RootState) => state.user)
  const [mutate] = useRequestLab()
  const [newNoteText, setNewNoteText] = useState('')
  const [error, setError] = useState<LabError | undefined>(undefined)
  const [visitOptions, setVisitOptions] = useState([] as SelectOption[])

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('labs.requests.new'))
  })
  const [newLabRequest, setNewLabRequest] = useState({
    patient: '',
    type: '',
    status: 'requested',
    requestedBy: user?.id || '',
    requestedOn: '',
    visitId: '',
  })

  const breadcrumbs = [
    {
      i18nKey: 'labs.requests.new',
      location: `/labs/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    if (patient) {
      const visits = patient.visits?.map((v) => ({
        label: `${v.type} at ${format(new Date(v.startDateTime), 'yyyy-MM-dd hh:mm a')}`,
        value: v.id,
      })) as SelectOption[]

      setVisitOptions(visits)
      setNewLabRequest((previousNewLabRequest) => ({
        ...previousNewLabRequest,
        patient: patient.id,
        fullName: patient.fullName,
      }))
    } else {
      setVisitOptions([])
      setNewLabRequest((previousNewLabRequest) => ({
        ...previousNewLabRequest,
        patient: '',
        visitId: '',
      }))
    }
  }

  const onLabTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.currentTarget.value
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      type,
    }))
  }

  const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const noteText = event.currentTarget.value
    setNewNoteText(noteText)

    const newNote: Note = {
      id: uuid(),
      date: new Date().toISOString(),
      text: noteText,
      deleted: false,
    }

    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      notes: [newNote],
    }))
  }

  const onSave = async () => {
    try {
      const newLab = await mutate(newLabRequest as Lab)
      history.push(`/labs/${newLab?.id}`)
      Toast(
        'success',
        t('states.success'),
        `${t('labs.successfullyCreated')} ${newLab?.type} ${t('labs.lab.for')} ${
          (await PatientRepository.find(newLab?.patient || '')).fullName
        }`,
      )
      setError(undefined)
    } catch (e) {
      setError(e)
    }
  }

  const onVisitChange = (visitId: string) => {
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      visitId,
    }))
  }

  const onCancel = () => {
    history.push('/labs')
  }

  const defaultSelectedVisitsOption = () => {
    if (visitOptions !== undefined) {
      return visitOptions.filter(({ value }) => value === newLabRequest.visitId)
    }
    return []
  }

  return (
    <>
      {error && <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />}
      <form>
        <Row>
          <Column>
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
          </Column>
          <Column>
            <div className="form-group" data-testid="visitSelect">
              <Label text={t('patient.visit')} title="This is a required input" isRequired />
              <Select
                id="visit"
                options={visitOptions || []}
                defaultSelected={defaultSelectedVisitsOption()}
                onChange={(values) => {
                  onVisitChange(values[0])
                }}
                disabled={false}
              />
            </div>
          </Column>
        </Row>
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
            value={newNoteText}
            onChange={onNoteChange}
          />
        </div>
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3 mr-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('labs.requests.new')}
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
