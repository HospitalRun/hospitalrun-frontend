/* eslint-disable no-console */

import * as components from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import assign from 'lodash/assign'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NoteTab from '../../../patients/notes/NoteTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import Note from '../../../shared/model/Note'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '123',
  notes: [{ date: new Date().toISOString(), text: 'notes1' } as Note],
} as Patient

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let user: any
let store: any

const setup = (props: any = {}) => {
  const { permissions, patient, route } = assign(
    {},
    {
      patient: expectedPatient,
      permissions: [Permissions.WritePatients],
      route: '/patients/123/notes',
    },
    props,
  )

  user = { permissions }
  store = mockStore({ patient, user } as any)
  history.push(route)
  let wrapper: any
  act(() => {
    wrapper = mount(
      <Router history={history}>
        <Provider store={store}>
          <NoteTab patient={patient} />
        </Provider>
      </Router>,
    )
  })

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
      const wrapper = setup({ permissions: [] })

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
  describe('/patients/:id/notes', () => {
    it('should render the view notes screen when /patients/:id/notes is accessed', () => {
      const route = '/patients/123/notes'
      const permissions = [Permissions.WritePatients]
      const wrapper = setup({ route, permissions })
      act(() => {
        expect(wrapper.exists(NoteTab)).toBeTruthy()
      })
    })
  })
})
