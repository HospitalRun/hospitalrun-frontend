import { Modal, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'

import { NoteError } from '../../patients/util/validate-note'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import useTranslator from '../hooks/useTranslator'
import Note from '../model/Note'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
  onSave: (note: Note) => void
  setNote: (note: Note) => void
  note: Note // New if note.date === ''
}

const NewNoteModal = ({ note, onCloseButtonClick, onSave, setNote, show, toggle }: Props) => {
  const { t } = useTranslator()

  const [noteError, setNoteError] = useState<NoteError | undefined>(undefined)

  const onNoteTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote({
      ...note,
      text: event.currentTarget.value,
    })
  }

  const onSaveButtonClick = async () => {
    if (note.text === '') {
      setNoteError({
        noteError: 'patient.notes.error.noteRequired',
        name: 'Empty String',
        message: 'patient.notes.error.noteRequired',
      })
    } else {
      try {
        const updatedNote = {
          ...note,
          date: new Date(Date.now()).toISOString(),
        }
        setNote(updatedNote)
        onSave(updatedNote)
        onCloseButtonClick()
      } catch (e) {
        setNoteError(e)
      }
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
  const actionString = note.date ? t('patient.notes.edit') : t('patient.notes.new')
  return (
    <Modal
      show={show}
      toggle={toggle}
      title={actionString}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: actionString,
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default NewNoteModal
