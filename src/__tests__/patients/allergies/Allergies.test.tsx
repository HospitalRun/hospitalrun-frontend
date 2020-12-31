import { render as rtlRender, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Allergies from '../../../patients/allergies/Allergies'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()
const expectedPatient = {
  id: '123',
  rev: '123',
  allergies: [
    { id: '1', name: 'allergy1' },
    { id: '2', name: 'allergy2' },
  ],
} as Patient

const newAllergy = 'allergy3'
let store: any

type WrapperProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

const setup = async (
  patient = expectedPatient,
  permissions = [Permissions.AddAllergy],
  route = '/patients/123/allergies',
) => {
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  jest.spyOn(PatientRepository, 'saveOrUpdate')

  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)

  function Wrapper({ children }: WrapperProps) {
    return (
      <Router history={history}>
        <Provider store={store}>{children}</Provider>
      </Router>
    )
  }
  return rtlRender(<Allergies patient={patient} />, { wrapper: Wrapper })
}

describe('Allergies', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('add new allergy button', () => {
    it('should render a button to add new allergies', () => {
      setup()

      expect(
        screen.getByRole('button', {
          name: /patient\.allergies\.new/i,
        }),
      ).toBeInTheDocument()
    })

    it('should not render a button to add new allergies if the user does not have permissions', () => {
      setup(expectedPatient, [])

      expect(
        screen.queryByRole('button', {
          name: /patient\.allergies\.new/i,
        }),
      ).not.toBeInTheDocument()
    })
  })

  describe('add new allergy modal ', () => {
    it('should open the new allergy modal when clicked', async () => {
      setup(expectedPatient)

      userEvent.click(
        screen.getByRole('button', {
          name: /patient\.allergies\.new/i,
        }),
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should add new allergy', async () => {
      setup(expectedPatient)

      userEvent.click(
        screen.getByRole('button', {
          name: /patient\.allergies\.new/i,
        }),
      )

      userEvent.type(
        screen.getByRole('textbox', {
          name: /this is a required input/i,
        }),
        newAllergy,
      )

      userEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: /patient\.allergies\.new/i,
        }),
      )

      expect(await screen.findByText(newAllergy)).toBeInTheDocument()
    })
  })

  describe('allergy list', () => {
    it('should render allergies', async () => {
      setup()

      await waitFor(() => {
        expect(
          screen.getAllByRole('button', {
            name: /allergy/i,
          }),
        ).toHaveLength(2)
      })
    })
  })
})
