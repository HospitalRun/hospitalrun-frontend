import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import Note from '../../shared/model/Note'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import NewNoteModal from '../../shared/notes/NewNoteModal'
import { RootState } from '../../shared/store'
import { uuid } from '../../shared/util/uuid'
import useAddPatientNote from '../hooks/useAddPatientNote'
import NotesList from './NotesList'
import ViewNote from './ViewNote'

interface Props {
  patient: Patient
}

const NoteTab = (props: Props) => {
  const { patient } = props
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewNoteModal, setShowNoteModal] = useState<boolean>(false)
  const defaultNoteValue = {
    id: uuid(),
    givenBy: 'some user',
    text: '',
    date: '',
  }
  const [newNote, setNewNote] = useState<Note>(defaultNoteValue)
  const [mutate] = useAddPatientNote()

  const breadcrumbs = [
    {
      i18nKey: 'patient.notes.label',
      location: `/patients/${patient.id}/notes`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onNewNoteClick = () => {
    setNewNote(defaultNoteValue)
    setShowNoteModal(true)
  }

  const closeNewNoteModal = () => {
    setShowNoteModal(false)
    setNewNote(defaultNoteValue)
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.WritePatients) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={onNewNoteClick}
            >
              {t('patient.notes.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <Switch>
        <Route exact path="/patients/:id/notes">
          <NotesList patientId={patient.id} />
        </Route>
        <Route exact path="/patients/:id/notes/:noteId">
          <ViewNote />
        </Route>
      </Switch>

      <NewNoteModal
        show={showNewNoteModal}
        toggle={closeNewNoteModal}
        onCloseButtonClick={closeNewNoteModal}
        onSave={async (note: Note) => {
          await mutate({ note, patientId: patient.id })
        }}
        note={newNote}
        setNote={setNewNote}
      />
    </div>
  )
}

export default NoteTab
