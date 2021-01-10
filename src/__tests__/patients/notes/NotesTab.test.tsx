import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import assign from 'lodash/assign'
import React from 'react'
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
  return render(
    <Router history={history}>
      <Provider store={store}>
        <NoteTab patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('Notes Tab', () => {
  describe('Add New Note', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'saveOrUpdate')
    })

    it('should render a add notes button', () => {
      setup()

      expect(screen.getByRole('button', { name: /patient\.notes\.new/i })).toBeInTheDocument()
    })

    it('should not render a add notes button if the user does not have permissions', () => {
      setup({ permissions: [] })

      expect(screen.queryByRole('button', { name: /patient\.notes\.new/i })).not.toBeInTheDocument()
    })

    it('should open the Add Notes Modal', () => {
      setup()

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      const addButton = screen.getByRole('button', { name: /patient\.notes\.new/i })
      userEvent.click(addButton)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
  describe('/patients/:id/notes', () => {
    it('should render the view notes screen when /patients/:id/notes is accessed', () => {
      const route = '/patients/123/notes'
      const permissions = [Permissions.WritePatients]
      setup({ route, permissions })

      expect(screen.getByText(/patient\.notes\.new/i)).toBeInTheDocument()
    })
  })
})
