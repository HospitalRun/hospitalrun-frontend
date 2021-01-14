import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import ViewMedications from '../../../medications/search/ViewMedications'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import MedicationRepository from '../../../shared/db/MedicationRepository'
import Medication from '../../../shared/model/Medication'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('View Medications', () => {
  const setup = async (
    medication: Medication,
    permissions: Permissions[] = [],
    givenMedications: Medication[] = [],
  ) => {
    const expectedMedication = ({
      id: '1234',
      medication: 'medication',
      patient: 'patientId',
      status: 'draft',
      intent: 'order',
      priority: 'routine',
      quantity: { value: 1, unit: 'unit' },
      requestedOn: '2020-03-30T04:43:20.102Z',
    } as unknown) as Medication
    const history = createMemoryHistory()
    const store = mockStore({
      user: { permissions },
      medications: { medications: [{ ...expectedMedication, ...medication }] },
    } as any)
    jest.resetAllMocks()
    const setButtonToolBarSpy = jest.fn()
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue(givenMedications)
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])

    return {
      history,
      setButtonToolBarSpy,
      ...render(
        <Provider store={store}>
          <Router history={history}>
            <TitleProvider>
              <ViewMedications />
            </TitleProvider>
          </Router>
        </Provider>,
      ),
    }
  }

  describe('button bar', () => {
    it('should display button to add new medication request', async () => {
      const permissions = [Permissions.ViewMedications, Permissions.RequestMedication]
      const { setButtonToolBarSpy } = await setup({ medication: 'test' } as Medication, permissions)
      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('medications.requests.new')
    })

    it('should not display button to add new medication request if the user does not have permissions', async () => {
      const { setButtonToolBarSpy } = await setup({} as Medication)

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

  describe('table', () => {
    it('should render a table with data with the default search', async () => {
      setup({} as Medication, [Permissions.ViewMedications])

      expect(await screen.findByRole('table')).toBeInTheDocument()
      expect(screen.getByLabelText(/medications\.search/i)).toHaveDisplayValue('')
    })
  })

  describe('search', () => {
    it('should render a medication request search component', async () => {
      setup({} as Medication)

      const search = screen.getByLabelText(/medications\.search/i)
      expect(search).toBeInTheDocument()
      expect(search).toHaveDisplayValue('')
    })

    it('should update the table when the search changes', async () => {
      const expectedSearchRequest: MedicationSearchRequest = {
        text: 'someNewText',
        status: 'draft',
      }
      const expectedMedicationRequests: Medication[] = [
        {
          id: 'someId',
          medication: expectedSearchRequest.text,
          status: expectedSearchRequest.status,
        } as Medication,
      ]
      setup(
        { medication: expectedSearchRequest.text } as Medication,
        [],
        expectedMedicationRequests,
      )
      userEvent.type(screen.getByLabelText(/medications\.search/i), expectedSearchRequest.text)
      expect(await screen.findByRole('table')).toBeInTheDocument()

      expect(screen.getByText(expectedSearchRequest.text)).toBeInTheDocument()
    })
  })
})
