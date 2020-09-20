import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRequestSearch from '../../../medications/search/MedicationRequestSearch'
import MedicationRequestTable from '../../../medications/search/MedicationRequestTable'
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
  const setup = async (medication: Medication, permissions: Permissions[] = []) => {
    let wrapper: any
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
    const titleSpy = jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    const setButtonToolBarSpy = jest.fn()
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue([])
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <TitleProvider>
              <ViewMedications />
            </TitleProvider>
          </Router>
        </Provider>,
      )
    })
    wrapper.update()
    return {
      wrapper: wrapper as ReactWrapper,
      history,
      titleSpy,
      setButtonToolBarSpy,
    }
  }

  describe('title', () => {
    it('should have called the useUpdateTitle hook', async () => {
      const { titleSpy } = await setup({} as Medication)

      expect(titleSpy).toHaveBeenCalled()
    })
  })

  describe('button bar', () => {
    it('should display button to add new medication request', async () => {
      const permissions = [Permissions.ViewMedications, Permissions.RequestMedication]
      const { setButtonToolBarSpy } = await setup({} as Medication, permissions)

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
      const { wrapper } = await setup({} as Medication, [Permissions.ViewMedications])

      const table = wrapper.find(MedicationRequestTable)
      expect(table).toHaveLength(1)
      expect(table.prop('searchRequest')).toEqual({ text: '', status: 'all' })
    })
  })

  describe('search', () => {
    it('should render a medication request search component', async () => {
      const { wrapper } = await setup({} as Medication)

      const search = wrapper.find(MedicationRequestSearch)
      expect(search).toHaveLength(1)
      expect(search.prop('searchRequest')).toEqual({ text: '', status: 'all' })
    })

    it('should update the table when the search changes', async () => {
      const expectedSearchRequest: MedicationSearchRequest = {
        text: 'someNewText',
        status: 'draft',
      }
      const { wrapper } = await setup({} as Medication)

      await act(async () => {
        const search = wrapper.find(MedicationRequestSearch)
        const onChange = search.prop('onChange')
        await onChange(expectedSearchRequest)
      })
      wrapper.update()

      const table = wrapper.find(MedicationRequestTable)
      expect(table.prop('searchRequest')).toEqual(expectedSearchRequest)
    })
  })
})
