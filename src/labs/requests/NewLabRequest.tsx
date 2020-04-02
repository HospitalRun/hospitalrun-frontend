import React, { useState } from 'react'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import { Typeahead, Label, Button, Alert } from '@hospitalrun/components'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import { useHistory } from 'react-router'
import LabRepository from 'clients/db/LabRepository'
import Lab from 'model/Lab'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'

const NewLabRequest = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('labs.requests.new'))

  const [isPatientInvalid, setIsPatientInvalid] = useState(false)
  const [isTypeInvalid, setIsTypeInvalid] = useState(false)
  const [typeFeedback, setTypeFeedback] = useState()

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

    if (!newLab.patientId) {
      setIsPatientInvalid(true)
      return
    }

    if (!newLab.type) {
      setIsTypeInvalid(true)
      setTypeFeedback(t('labs.requests.error.typeRequired'))
      return
    }

    newLab.requestedOn = new Date(Date.now().valueOf()).toISOString()
    const createdLab = await LabRepository.save(newLab)
    history.push(`/labs/${createdLab.id}`)
  }
  const onCancel = () => {
    history.push('/labs')
  }

  return (
    <>
      {(isTypeInvalid || isPatientInvalid) && (
        <Alert
          color="danger"
          title={t('states.error')}
          message={t('labs.requests.error.unableToRequest')}
        />
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
            isInvalid={isPatientInvalid}
          />
        </div>
        <TextInputWithLabelFormGroup
          name="labType"
          label={t('labs.lab.type')}
          isRequired
          isEditable
          isInvalid={isTypeInvalid}
          feedback={typeFeedback}
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
