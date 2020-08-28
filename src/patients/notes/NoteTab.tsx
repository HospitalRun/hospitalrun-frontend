import { Button } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import NewNoteModal from './NewNoteModal'
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

  const breadcrumbs = [
    {
      i18nKey: 'patient.notes.label',
      location: `/patients/${patient.id}/notes`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onNewNoteClick = () => {
    setShowNoteModal(true)
  }

  const closeNewNoteModal = () => {
    setShowNoteModal(false)
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
        patientId={patient.id}
      />
    </div>
  )
}

export default NoteTab
