import { Modal, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'

import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import { uuid } from '../../shared/util/uuid'
import Note from '../../shared/model/Note'
import { NoteError } from '../util/validate-note'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
  onSave: (note: Note) => void
}

const NewNoteModal = (props: Props) => {

  

  const { show, toggle, onCloseButtonClick, onSave } = props
  const { t } = useTranslator()

  const [noteError, setNoteError] = useState<NoteError | undefined>(undefined)
  const [text, setText] = useState('')

  const onNoteTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value)
  }

  const onSaveButtonClick = async () => {
    try {
      onSave({
        id: uuid(),
        date: new Date().toISOString(),
        // TODO: Implement givenBy
        text,
      })
      setText('')
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
              value={text}
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
