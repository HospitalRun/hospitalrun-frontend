// eslint-disable-next-line no-restricted-imports
import '../../../__mocks__/matchMediaMock'

import * as components from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from 'clients/db/PatientRepository'
import Note from 'model/Note'
import Patient from 'model/Patient'
import Permissions from 'model/Permissions'
import NoteTab from 'patients/notes/NoteTab'

const expectedPatient = {
  id: '123',
  notes: [{ date: new Date().toISOString(), text: 'notes1' } as Note],
} as Patient

const mockStore = configureMockStore([thunk])
const history = createMemoryHistory()

let user: any
let store: any

const setup = (patient = expectedPatient, permissions = [Permissions.WritePatients]) => {
  user = { permissions }
  store = mockStore({ patient, user })
  const wrapper = mount(
    <Router history={history}>
      <Provider store={store}>
        <NoteTab patient={patient} />
      </Provider>
    </Router>,
  )

  return wrapper
}

describe('Notes Tab', () => {
  describe('Add New Note', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
    })

    it('should render a add notes button', () => {
      const wrapper = setup()

      const addNoteButton = wrapper.find(components.Button)
      expect(addNoteButton).toHaveLength(1)
      expect(addNoteButton.text().trim()).toEqual('patient.notes.new')
    })

    it('should not render a add notes button if the user does not have permissions', () => {
      const wrapper = setup(expectedPatient, [])

      const addNotesButton = wrapper.find(components.Button)
      expect(addNotesButton).toHaveLength(0)
    })

    it('should open the Add Notes Modal', () => {
      const wrapper = setup()

      act(() => {
        const onClick = wrapper.find(components.Button).prop('onClick') as any
        onClick()
      })
      wrapper.update()

      expect(wrapper.find(components.Modal).prop('show')).toBeTruthy()
    })
  })

  describe('notes list', () => {
    it('should list the patients diagnoses', () => {
      const notes = expectedPatient.notes as Note[]
      const wrapper = setup()

      const list = wrapper.find(components.List)
      const listItems = wrapper.find(components.ListItem)

      expect(list).toHaveLength(1)
      expect(listItems).toHaveLength(notes.length)
    })

    it('should render a warning message if the patient does not have any diagnoses', () => {
      const wrapper = setup({ ...expectedPatient, notes: [] })

      const alert = wrapper.find(components.Alert)

      expect(alert).toHaveLength(1)
      expect(alert.prop('title')).toEqual('patient.notes.warning.noNotes')
      expect(alert.prop('message')).toEqual('patient.notes.addNoteAbove')
    })
  })
})
