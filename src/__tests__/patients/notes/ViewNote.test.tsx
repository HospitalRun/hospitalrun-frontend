import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewNote from '../../../patients/notes/ViewNote'
import PatientRepository from '../../../shared/db/PatientRepository'
import Note from '../../../shared/model/Note'
import Patient from '../../../shared/model/Patient'

describe('View Note', () => {
  const patient = {
    id: 'patientId',
    notes: [{ id: '123', text: 'some name', date: '1947-09-09T14:48:00.000Z' }] as Note[],
  } as Patient

  it('should render a note input with the correct data', async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory({
      initialEntries: [`/patients/${patient.id}/notes/${(patient.notes as Note[])[0].id}`],
    })

    render(
      <Router history={history}>
        <Route path="/patients/:id/notes/:noteId">
          <ViewNote />
        </Route>
      </Router>,
    )

    const input = await screen.findByLabelText(/patient.note/i)
    expect(input).toHaveValue((patient.notes as Note[])[0].text)
  })
})
