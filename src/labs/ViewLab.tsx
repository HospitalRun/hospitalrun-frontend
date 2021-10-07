import { Row, Column, Badge, Button, Alert, Toast, Callout, Label } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../page-header/title/TitleContext'
import usePatient from '../patients/hooks/usePatient'
import TextFieldWithLabelFormGroup from '../shared/components/input/TextFieldWithLabelFormGroup'
import useTranslator from '../shared/hooks/useTranslator'
import Lab from '../shared/model/Lab'
import Patient from '../shared/model/Patient'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import { uuid } from '../shared/util/uuid'
import useCancelLab from './hooks/useCancelLab'
import useCompleteLab from './hooks/useCompleteLab'
import useLab from './hooks/useLab'
import useUpdateLab from './hooks/useUpdateLab'
import { LabError } from './utils/validate-lab'

const getTitle = (patient: Patient | undefined, lab: Lab | undefined) =>
  patient && lab ? `${lab.type} for ${patient.fullName}(${lab.code})` : ''

const ViewLab = () => {
  const { id } = useParams()
  const { t } = useTranslator()
  const history = useHistory()
  const { permissions } = useSelector((state: RootState) => state.user)

  const [labToView, setLabToView] = useState<Lab>()
  const [newNoteText, setNewNoteText] = useState<string>()
  const [isEditable, setIsEditable] = useState<boolean>(true)

  const { data: lab } = useLab(id)
  const { data: patient } = usePatient(lab?.patient)
  const [updateLab] = useUpdateLab()
  const [completeLab] = useCompleteLab()
  const [cancelLab] = useCancelLab()
  const [error, setError] = useState<LabError | undefined>(undefined)

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(getTitle(patient, labToView))
  })

  const breadcrumbs = [
    {
      i18nKey: 'labs.requests.view',
      location: `/labs/${labToView?.id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    if (lab) {
      setLabToView({ ...lab })
      setIsEditable(lab.status === 'requested')
    }
  }, [lab])

  const onResultChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = event.currentTarget.value
    const newLab = labToView as Lab
    setLabToView({ ...newLab, result })
  }

  const onNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    setNewNoteText(notes)
  }

  const deleteNote = async (noteIdToDelete: string) => {
    if (!labToView || !labToView.notes) {
      return
    }

    const updatedNotes = labToView!.notes!.map((note) => {
      if (note.id === noteIdToDelete) {
        note.deleted = true
      }

      return note
    })

    const newLab = {
      ...labToView,
      notes: updatedNotes,
    }

    await updateLab(newLab as Lab)
    Toast('success', t('states.success'), t('labs.successfullyDeletedNote'))
  }

  const onUpdate = async () => {
    if (labToView) {
      const newLab = labToView as Lab

      if (newNoteText) {
        const newNote = {
          id: uuid(),
          date: new Date().toISOString(),
          text: newNoteText,
          deleted: false,
        }

        newLab.notes = newLab.notes ? [...newLab.notes, newNote] : [newNote]
        setNewNoteText('')
      }

      const updatedLab = await updateLab(newLab)
      history.push(`/labs/${updatedLab?.id}`)
      Toast(
        'success',
        t('states.success'),
        `${t('labs.successfullyUpdated')} ${updatedLab?.type} for ${patient?.fullName}`,
      )
    }
    setError(undefined)
  }

  const onComplete = async () => {
    try {
      if (labToView) {
        const completedLab = await completeLab(labToView)
        history.push(`/labs/${completedLab?.id}`)
        Toast(
          'success',
          t('states.success'),
          `${t('labs.successfullyCompleted')} ${completedLab?.type} for ${patient?.fullName} `,
        )
      }
      setError(undefined)
    } catch (e) {
      setError(e)
    }
  }

  const onCancel = async () => {
    if (labToView) {
      cancelLab(labToView)
      history.push('/labs')
    }
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (labToView?.status === 'completed' || labToView?.status === 'canceled') {
      return buttons
    }

    buttons.push(
      <Button className="mr-2" color="success" onClick={onUpdate} key="actions.update">
        {t('labs.requests.update')}
      </Button>,
    )

    if (permissions.includes(Permissions.CompleteLab)) {
      buttons.push(
        <Button className="mr-2" onClick={onComplete} color="primary" key="labs.requests.complete">
          {t('labs.requests.complete')}
        </Button>,
      )
    }

    if (permissions.includes(Permissions.CancelLab)) {
      buttons.push(
        <Button onClick={onCancel} color="danger" key="labs.requests.cancel">
          {t('labs.requests.cancel')}
        </Button>,
      )
    }

    return buttons
  }

  if (labToView && patient) {
    const getBadgeColor = () => {
      if (labToView.status === 'completed') {
        return 'primary'
      }
      if (labToView.status === 'canceled') {
        return 'danger'
      }
      return 'warning'
    }

    const getCanceledOnOrCompletedOnDate = () => {
      if (labToView.status === 'completed' && labToView.completedOn) {
        return (
          <Column>
            <div className="form-group completed-on">
              <h4>{t('labs.lab.completedOn')}</h4>
              <h5>{format(new Date(labToView.completedOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
        )
      }
      if (labToView.status === 'canceled' && labToView.canceledOn) {
        return (
          <Column>
            <div className="form-group canceled-on">
              <h4>{t('labs.lab.canceledOn')}</h4>
              <h5>{format(new Date(labToView.canceledOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
        )
      }
      return <></>
    }

    const getPastNotes = () => {
      if (labToView?.notes?.length && labToView.notes.length > 0) {
        return labToView.notes
          .filter((note) => !note.deleted)
          .map((note) => (
            <Callout key={note.id} color="info">
              <div className="d-flex justify-content-between">
                <p data-testid="note">{note.text}</p>
                {labToView.status === 'requested' && (
                  <Button icon="remove" onClick={async () => deleteNote(note.id)} color="danger">
                    <span data-testid={`delete-note-${note.id}`}>Delete</span>
                  </Button>
                )}
              </div>
            </Callout>
          ))
      }

      return <></>
    }

    return (
      <>
        {error && (
          <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
        )}
        <Row>
          <Column>
            <div className="form-group lab-status">
              <h4>{t('labs.lab.status')}</h4>
              <Badge color={getBadgeColor()}>
                <h5>{labToView.status}</h5>
              </Badge>
            </div>
          </Column>
          <Column>
            <div className="form-group for-patient">
              <h4>{t('labs.lab.for')}</h4>
              <h5>{patient.fullName}</h5>
            </div>
          </Column>
          <Column>
            <div className="form-group lab-type">
              <h4>{t('labs.lab.type')}</h4>
              <h5>{labToView.type}</h5>
            </div>
          </Column>
          <Column>
            <div className="form-group requested-on">
              <h4>{t('labs.lab.requestedOn')}</h4>
              <h5>{format(new Date(labToView.requestedOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
          {getCanceledOnOrCompletedOnDate()}
        </Row>
        <div className="border-bottom" />
        <form>
          <TextFieldWithLabelFormGroup
            name="result"
            label={t('labs.lab.result')}
            value={labToView.result}
            isEditable={isEditable}
            isInvalid={!!error?.result}
            feedback={t(error?.result as string)}
            onChange={onResultChange}
          />
          <Label text={t('labs.lab.notes')} htmlFor="notesTextField" />
          {getPastNotes()}
          {isEditable && (
            <TextFieldWithLabelFormGroup
              name="notes"
              value={newNoteText}
              isEditable={isEditable}
              onChange={onNotesChange}
            />
          )}
          {isEditable && (
            <div className="row float-right">
              <div className="btn-group btn-group-lg mt-3 mr-3">{getButtons()}</div>
            </div>
          )}
        </form>
      </>
    )
  }
  return <h1>Loading...</h1>
}

export default ViewLab
