import { Row, Column, Typeahead, Label, Button, Alert } from '@hospitalrun/components'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import { fetchPatientAppointments } from '../../scheduling/appointments/appointments-slice'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'
import { requestLab, resetLab } from '../lab-slice'

const NewLabRequest = () => {
  const { t } = useTranslator()
  const dispatch = useDispatch()
  const history = useHistory()
  useTitle(t('labs.requests.new'))

  const { status, error, appointments } = useSelector((state: RootState) => state.lab)
  // const { appointments } = useSelector((state: RootState) => state.lab)
  let appointmentOptions = [] as any

  const [newLabRequest, setNewLabRequest] = useState({
    patient: '',
    appointment: '',
    type: '',
    notes: '',
    status: 'requested',
  })

  useEffect(() => {
    dispatch(resetLab())
  }, [dispatch])

  const breadcrumbs = [
    {
      i18nKey: 'labs.requests.new',
      location: `/labs/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    if (patient) {
      setNewLabRequest((previousNewLabRequest) => ({
        ...previousNewLabRequest,
        patient: patient.id,
      }))
      dispatch(fetchPatientAppointments(patient.id))
    } else {
      setNewLabRequest((previousNewLabRequest) => ({
        ...previousNewLabRequest,
        patient: '',
        appointment: '',
      }))
    }
  }

  const onAppointmentChange = (appointment: string) => {
    setNewLabRequest((previousNewLabRequest) => ({
      ...previousNewLabRequest,
      appointment,
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
    const newLab = (newLabRequest as unknown) as Lab
    const onSuccess = (createdLab: Lab) => {
      history.push(`/labs/${createdLab.id}`)
    }
    dispatch(requestLab(newLab, onSuccess))
  }

  const onCancel = () => {
    history.push('/labs')
  }

  appointmentOptions =
    appointments &&
    (appointments.map((appointment: any) => ({
      label: `${new Date(appointment.startDateTime).toLocaleString()}`,
      value: `${new Date(appointment.startDateTime).toLocaleString()}`,
    })) as Option[])

  return (
    <>
      {status === 'error' && (
        <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
      )}
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
                isInvalid={!!error.patient}
              />
            </div>
          </Column>
          <Column>
            <div className="appointments">
              {newLabRequest.patient ? (
                <SelectWithLabelFormGroup
                  name="appointments"
                  label={t('Appointments')}
                  options={appointmentOptions}
                  defaultSelected={appointmentOptions.filter(
                    ({ value }) => value === newLabRequest.appointment,
                  )}
                  onChange={(values) => onAppointmentChange(values[0])}
                  isRequired
                  isEditable
                />
              ) : (
                ''
              )}
            </div>
          </Column>
        </Row>
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
