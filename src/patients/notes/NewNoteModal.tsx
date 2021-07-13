import { Modal, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'

import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import useAddPatientNote from '../hooks/useAddPatientNote'
import { NoteError } from '../util/validate-note'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
  patientId: string
}
const initialNoteState = { text: '', date: new Date().toISOString(), deleted: false }

const NewNoteModal = (props: Props) => {
  const { show, toggle, onCloseButtonClick, patientId } = props
  const { t } = useTranslator()
  const [mutate] = useAddPatientNote()

  const [noteError, setNoteError] = useState<NoteError | undefined>(undefined)
  const [note, setNote] = useState(initialNoteState)

  const onNoteTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.currentTarget.value
    setNote({
      ...note,
      text,
    })
  }

  const onSaveButtonClick = async () => {
    try {
      await mutate({ patientId, note })
      setNote(initialNoteState)
      onCloseButtonClick()
    } catch (e) {
      setNoteError(e)
    }
  }

  const body = (
    <form>
      {noteError && (
        <Alert
          color="danger"
          title={t('states.error')}
          message={t('patient.notes.error.unableToAdd')}
        />
      )}
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <TextFieldWithLabelFormGroup
              isEditable
              isRequired
              name="noteTextField"
              label={t('patient.note')}
              value={note.text}
              isInvalid={!!noteError?.noteError}
              feedback={t(noteError?.noteError || '')}
              onChange={onNoteTextChange}
            />
          </div>
        </div>
      </div>
    </form>
  )

  return (
    <Modal
      show={show}
      toggle={toggle}
      title={t('patient.notes.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: t('patient.notes.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default NewNoteModal
