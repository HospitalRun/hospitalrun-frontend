import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { TextInput, Button, Spinner, ListItem } from '@hospitalrun/components'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { mocked } from 'ts-jest/utils'
import { act } from 'react-dom/test-utils'
import Patients from '../../../patients/list/Patients'
import PatientRepository from '../../../clients/db/PatientRepository'
import * as patientSlice from '../../../patients/patients-slice'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Patients', () => {
  const patients = [{ fullName: 'test test', friendlyId: 'P12345' }]
  const mockedPatientRepository = mocked(PatientRepository, true)

  const setup = (isLoading?: boolean) => {
    const store = mockStore({
      patients: {
        patients,
        isLoading,
      },
    })
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <Patients />
        </MemoryRouter>
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'findAll')
    mockedPatientRepository.findAll.mockResolvedValue([])
  })

  describe('layout', () => {
    it('should render a search input with button', () => {
      const wrapper = setup()
      const searchInput = wrapper.find(TextInput)
      const searchButton = wrapper.find(Button)
      expect(searchInput).toHaveLength(1)
      expect(searchInput.prop('placeholder')).toEqual('actions.search')
      expect(searchButton.text().trim()).toEqual('actions.search')
    })

    it('should render a loading bar if it is loading', () => {
      const wrapper = setup(true)

      expect(wrapper.find(Spinner)).toHaveLength(1)
    })

    it('should render a list of patients', () => {
      const wrapper = setup()

      const patientListItems = wrapper.find(ListItem)
      expect(patientListItems).toHaveLength(1)
      expect(patientListItems.at(0).text()).toEqual(
        `${patients[0].fullName} (${patients[0].friendlyId})`,
      )
    })
  })

  describe('search functionality', () => {
    it('should call the searchPatients() action with the correct data', () => {
      const searchPatientsSpy = jest.spyOn(patientSlice, 'searchPatients')
      const expectedSearchText = 'search text'
      const wrapper = setup()

      act(() => {
        ;(wrapper.find(TextInput).prop('onChange') as any)({
          target: {
            value: expectedSearchText,
          },
          preventDefault(): void {
            // noop
          },
        } as React.ChangeEvent<HTMLInputElement>)
      })

      wrapper.update()

      act(() => {
        ;(wrapper.find(Button).prop('onClick') as any)({
          preventDefault(): void {
            // noop
          },
        } as React.MouseEvent<HTMLButtonElement>)
      })

      wrapper.update()

      expect(searchPatientsSpy).toHaveBeenCalledTimes(1)
      expect(searchPatientsSpy).toHaveBeenLastCalledWith(expectedSearchText)
    })
  })
})
