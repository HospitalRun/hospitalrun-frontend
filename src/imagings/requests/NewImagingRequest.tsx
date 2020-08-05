import { Typeahead, Label, Button, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Imaging from '../../shared/model/Imaging'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import { requestImaging } from '../imaging-slice'

const NewImagingRequest = () => {
  const { t } = useTranslator()
  const dispatch = useDispatch()
  const history = useHistory()
  useTitle(t('imagings.requests.new'))
  const { status, error } = useSelector((state: RootState) => state.imaging)

  const statusOptions: Option[] = [
    { label: t('imagings.status.requested'), value: 'requested' },
    { label: t('imagings.status.completed'), value: 'completed' },
    { label: t('imagings.status.canceled'), value: 'canceled' },
  ]

  const [newImagingRequest, setNewImagingRequest] = useState({
    patient: '',
    type: '',
    notes: '',
    status: '',
  })

  const breadcrumbs = [
    {
      i18nKey: 'imagings.requests.new',
      location: `/imaging/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      patient: patient.fullName as string,
    }))
  }

  const onImagingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.currentTarget.value
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      type,
    }))
  }

  const onStatusChange = (value: string) => {
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      status: value,
    }))
  }

  const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      notes,
    }))
  }

  const onSave = async () => {
    const newImaging = newImagingRequest as Imaging
    const onSuccess = () => {
      history.push(`/imaging`)
    }

    dispatch(requestImaging(newImaging, onSuccess))
  }

  const onCancel = () => {
    history.push('/imaging')
  }

  return (
    <>
      {status === 'error' && (
        <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
      )}
      <form>
        <div className="form-group patient-typeahead">
          <Label htmlFor="patientTypeahead" isRequired text={t('imagings.imaging.patient')} />
          <Typeahead
            id="patientTypeahead"
            placeholder={t('imagings.imaging.patient')}
            onChange={(p: Patient[]) => onPatientChange(p[0])}
            onSearch={async (query: string) => PatientRepository.search(query)}
            searchAccessor="fullName"
            renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
            isInvalid={!!error.patient}
            feedback={t(error.patient as string)}
          />
        </div>
        <TextInputWithLabelFormGroup
          name="imagingType"
          label={t('imagings.imaging.type')}
          isRequired
          isEditable
          isInvalid={!!error.type}
          feedback={t(error.type as string)}
          value={newImagingRequest.type}
          onChange={onImagingTypeChange}
        />
        <SelectWithLabelFormGroup
          name="status"
          label={t('imagings.imaging.status')}
          options={statusOptions}
          isRequired
          isEditable
          defaultSelected={statusOptions.filter(({ value }) => value === newImagingRequest.status)}
          onChange={(values) => onStatusChange(values[0])}
        />
        <div className="form-group">
          <TextFieldWithLabelFormGroup
            name="ImagingNotes"
            label={t('imagings.imaging.notes')}
            isEditable
            value={newImagingRequest.notes}
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

export default NewImagingRequest
