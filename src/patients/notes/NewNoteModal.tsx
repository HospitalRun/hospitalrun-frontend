import { Modal, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import Note from '../../model/Note'
import { RootState } from '../../store'
import { addNote } from '../patient-slice'

interface Props {
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
}

const NewNoteModal = (props: Props) => {
  const { show, toggle, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { patient, noteError } = useSelector((state: RootState) => state.patient)
  const { t } = useTranslation()
  const [note, setNote] = useState({
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
    dispatch(addNote(patient.id, note as Note))
  }

  const body = (
    <form>
      {noteError?.message && (
        <Alert color="danger" title={t('states.error')} message={t(noteError?.message || '')} />
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
              isInvalid={!!noteError?.note}
              feedback={t(noteError?.note || '')}
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
