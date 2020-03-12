import React, { useState } from 'react'
import { Modal, Alert, RichText, Label } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
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
  const [errorMessage, setErrorMessage] = useState('')
  const [note, setNote] = useState({
    noteDate: new Date(),
    text: '',
  })

  const onFieldChange = (key: string, value: string | any) => {
    setNote({
      ...note,
      [key]: value,
    })
  }

  const onRichTextElementChange = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    fieldName: string,
  ) => {
    onFieldChange(fieldName, event)
  }

  const body = (
    <form>
      {errorMessage && <Alert color="danger" title={t('states.error')} message={errorMessage} />}
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <Label text={t('patient.note')} htmlFor="noteText" />
            <RichText
              id="noteText"
              value={note.text}
              onChange={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                onRichTextElementChange(event, 'text')
              }}
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
        onClick: () => {
          let newErrorMessage = ''

          if (!note) {
            newErrorMessage += `${t('patient.notes.error.noteRequired')} `
          }

          if (!newErrorMessage) {
            onSave(note as Note)
          } else {
            setErrorMessage(newErrorMessage.trim())
          }
        },
      }}
    />
  )
}

export default NewNoteModal
