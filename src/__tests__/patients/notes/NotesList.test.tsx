import { Alert, List, ListItem } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import NotesList from '../../../patients/notes/NotesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Note from '../../../shared/model/Note'
import Patient from '../../../shared/model/Patient'

describe('Notes list', () => {
  const setup = async (notes: Note[]) => {
    const mockPatient = { id: '123', notes } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${mockPatient.id}/notes`)
    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <NotesList patientId={mockPatient.id} />
        </Router>,
      )
    })

    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a list of notes', async () => {
    const expectedNotes = [
      {
        id: '456',
        text: 'some name',
        date: '1947-09-09T14:48:00.000Z',
      },
    ]
    const { wrapper } = await setup(expectedNotes)
    const listItems = wrapper.find(ListItem)

    expect(wrapper.exists(List)).toBeTruthy()
    expect(listItems).toHaveLength(expectedNotes.length)
    expect(listItems.at(0).find('.ref__note-item-date').text().length)
    expect(listItems.at(0).find('.ref__note-item-text').text()).toEqual(expectedNotes[0].text)
  })

  it('should display a warning when no notes are present', async () => {
    const expectedNotes: Note[] = []
    const { wrapper } = await setup(expectedNotes)

    const alert = wrapper.find(Alert)

    expect(wrapper.exists(Alert)).toBeTruthy()
    expect(wrapper.exists(List)).toBeFalsy()

    expect(alert.prop('color')).toEqual('warning')
    expect(alert.prop('title')).toEqual('patient.notes.warning.noNotes')
    expect(alert.prop('message')).toEqual('patient.notes.addNoteAbove')
  })

  it('should navigate to the note view when the note is clicked', async () => {
    const expectedNotes = [{ id: '456', text: 'some name', date: '1947-09-09T14:48:00.000Z' }]
    const { wrapper, history } = await setup(expectedNotes)
    const item = wrapper.find(ListItem)
    act(() => {
      const onClick = item.prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/patients/123/notes/${expectedNotes[0].id}`)
  })
})
