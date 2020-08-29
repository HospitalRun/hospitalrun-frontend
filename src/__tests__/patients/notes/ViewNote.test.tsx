import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import ViewNote from '../../../patients/notes/ViewNote'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Note', () => {
  const patient = {
    id: 'patientId',
    notes: [{ id: '123', text: 'some name', date: '1947-09-09T14:48:00.000Z' }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/notes/${patient.notes![0].id}`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/notes/:noteId">
            <ViewNote />
          </Route>
        </Router>,
      )
    })

    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render a note input with the correct data', async () => {
    const { wrapper } = await setup()

    const noteText = wrapper.find(TextInputWithLabelFormGroup)
    expect(noteText).toHaveLength(1)
    expect(noteText.prop('value')).toEqual(patient.notes![0].text)
  })
})
