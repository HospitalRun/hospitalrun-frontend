import React, { useState } from 'react'
import { Modal, Alert } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import Note from '../../model/Note'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
  onSave: (note: Note) => void
}

const NewNoteModal = (props: Props) => {
  const { show, toggle, onCloseButtonClick, onSave } = props
  const { t } = useTranslation()
  const [isNoteInvalid, setIsNoteInvalid] = useState(false)
  const [noteFeedback, setNoteFeedback] = useState()
  const [note, setNote] = useState({
    date: new Date(Date.now().valueOf()).toISOString(),
    text: '',
  })

  const onFieldChange = (key: string, value: string | any) => {
    setNote({
      ...note,
      [key]: value,
    })
  }

  const onNoteTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.currentTarget.value
    onFieldChange('text', text)
  }

  const onSaveButtonClick = () => {
    if (!note.text) {
      setIsNoteInvalid(true)
      setNoteFeedback(t('patient.notes.error.noteRequired'))
      return
    }

    onSave(note as Note)
  }

  const body = (
    <form>
      {isNoteInvalid && (
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
              isInvalid={isNoteInvalid}
              feedback={noteFeedback}
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
