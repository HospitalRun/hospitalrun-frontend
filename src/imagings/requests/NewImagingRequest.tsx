import { Select, Typeahead, Label, Button, Alert, Column, Row } from '@hospitalrun/components'
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
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import useRequestImaging, { ImagingRequest } from '../hooks/useRequestImaging'
import { ImagingRequestError } from '../util/validate-imaging-request'

const NewImagingRequest = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const { user } = useSelector((state: RootState) => state.user)

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('imagings.requests.new'))
  })
  const [mutate] = useRequestImaging(user)
  const [error, setError] = useState<ImagingRequestError>()
  const [visitOption, setVisitOption] = useState([] as SelectOption[])

  const statusOptions: SelectOption[] = [
    { label: t('imagings.status.requested'), value: 'requested' },
    { label: t('imagings.status.completed'), value: 'completed' },
    { label: t('imagings.status.canceled'), value: 'canceled' },
  ]

  const [newImagingRequest, setNewImagingRequest] = useState<ImagingRequest>({
    patient: '',
    fullName: '',
    status: 'requested',
    notes: '',
    type: '',
    visitId: '',
  })

  const breadcrumbs = [
    {
      i18nKey: 'imagings.requests.new',
      location: `/imaging/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    if (patient) {
      setNewImagingRequest((previousNewImagingRequest) => ({
        ...previousNewImagingRequest,
        patient: patient.id,
        fullName: patient.fullName as string,
      }))

      const visits = patient.visits?.map((v) => ({
        label: `${v.type} at ${format(new Date(v.startDateTime), 'yyyy-MM-dd hh:mm a')}`,
        value: v.id,
      })) as SelectOption[]

      setVisitOption(visits)
    } else {
      setNewImagingRequest((previousNewImagingRequest) => ({
        ...previousNewImagingRequest,
        patient: '',
        fullName: '',
        visitId: '',
      }))
      setVisitOption([])
    }
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
      status: value as 'completed' | 'canceled' | 'requested',
    }))
  }

  const onVisitChange = (value: string) => {
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      visitId: value,
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
    try {
      await mutate(newImagingRequest)
      history.push(`/imaging`)
    } catch (e) {
      setError(e)
    }
  }

  const onCancel = () => {
    history.push('/imaging')
  }

  const defaultSelectedVisitsOption = () => {
    if (visitOption !== undefined) {
      return visitOption.filter(({ value }) => value === newImagingRequest.visitId)
    }
    return []
  }

  return (
    <>
      {error !== undefined && (
        <Alert color="danger" title={t('states.error')} message={t(error.message)} />
      )}
      <form>
        <Row>
          <Column>
            <div className="form-group patient-typeahead">
              <Label htmlFor="patientTypeahead" isRequired text={t('imagings.imaging.patient')} />
              <Typeahead
                id="patientTypeahead"
                placeholder={t('imagings.imaging.patient')}
                onChange={(p: Patient[]) => {
                  onPatientChange(p[0])
                }}
                onSearch={async (query: string) => PatientRepository.search(query)}
                searchAccessor="fullName"
                renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
                isInvalid={!!error?.patient}
                feedback={t(error?.patient)}
              />
            </div>
          </Column>
          <Column>
            <div className="visits" data-testid="visitSelect">
              <Label text={t('patient.visits.label')} title="visit" isRequired />
              <Select
                id="visitSelect"
                options={visitOption || []}
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
          name="imagingType"
          label={t('imagings.imaging.type')}
          isRequired
          isEditable
          isInvalid={!!error?.type}
          feedback={t(error?.type)}
          value={newImagingRequest.type}
          onChange={onImagingTypeChange}
        />
        <div className="imaging-status" data-testid="statusSelect">
          <Label text={t('imagings.imaging.status')} title="status" isRequired />
          <Select
            id="statusSelect"
            options={statusOptions}
            defaultSelected={statusOptions.filter(
              ({ value }) => value === newImagingRequest.status,
            )}
            onChange={(values) => onStatusChange(values[0])}
            disabled={false}
          />
        </div>
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
          <div className="btn-group btn-group-lg mt-3 mr-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('imagings.requests.create')}
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
