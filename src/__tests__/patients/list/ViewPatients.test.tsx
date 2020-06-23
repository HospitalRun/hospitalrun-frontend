import '../../../__mocks__/matchMediaMock'

import { TextInput, Spinner } from '@hospitalrun/components'
import format from 'date-fns/format'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import { UnpagedRequest } from '../../../clients/db/PageRequest'
import PatientRepository from '../../../clients/db/PatientRepository'
import * as ButtonBarProvider from '../../../page-header/ButtonBarProvider'
import ViewPatients from '../../../patients/list/ViewPatients'
import * as patientSlice from '../../../patients/patients-slice'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Patients', () => {
  const patients = [
    {
      id: '123',
      fullName: 'test test',
      isApproximateDateOfBirth: false,
      givenName: 'test',
      familyName: 'test',
      code: 'P12345',
      sex: 'male',
      dateOfBirth: new Date().toISOString(),
      phoneNumber: '99999999',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rev: '',
    },
  ]

  const setup = (isLoading?: boolean) => {
    const store = mockStore({
      patients: {
        patients,
        isLoading,
        pageRequest: UnpagedRequest,
      },
    })
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <ViewPatients />
        </MemoryRouter>
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'findAll').mockResolvedValue([])
    jest.spyOn(PatientRepository, 'search').mockResolvedValue([])
  })

  describe('initial load', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should call fetchPatients only once', () => {
      setup()
      expect(PatientRepository.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('layout', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should render a loading bar if it is loading', () => {
      const wrapper = setup(true)

      expect(wrapper.find(Spinner)).toHaveLength(1)
    })

    it('should render a table of patients', () => {
      const wrapper = setup()

      const table = wrapper.find('table')
      const tableHeaders = table.find('th')
      const tableColumns = table.find('td')

      expect(table).toHaveLength(1)
      expect(tableHeaders).toHaveLength(5)
      expect(tableColumns).toHaveLength(5)
      expect(tableHeaders.at(0).text()).toEqual('patient.code')
      expect(tableHeaders.at(1).text()).toEqual('patient.givenName')
      expect(tableHeaders.at(2).text()).toEqual('patient.familyName')
      expect(tableHeaders.at(3).text()).toEqual('patient.sex')
      expect(tableHeaders.at(4).text()).toEqual('patient.dateOfBirth')

      expect(tableColumns.at(0).text()).toEqual(patients[0].code)
      expect(tableColumns.at(1).text()).toEqual(patients[0].givenName)
      expect(tableColumns.at(2).text()).toEqual(patients[0].familyName)
      expect(tableColumns.at(3).text()).toEqual(patients[0].sex)
      expect(tableColumns.at(4).text()).toEqual(
        format(new Date(patients[0].dateOfBirth), 'yyyy-MM-dd'),
      )
    })

    it('should add a "New Patient" button to the button tool bar', () => {
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
      const setButtonToolBarSpy = jest.fn()
      mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

      setup()

      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('patients.newPatient')
    })
  })

  describe('search functionality', () => {
    beforeEach(() => jest.useFakeTimers())

    afterEach(() => jest.useRealTimers())

    it('should search for patients after the search text has not changed for 500 milliseconds', () => {
      const searchPatientsSpy = jest.spyOn(patientSlice, 'searchPatients')
      const wrapper = setup()
      searchPatientsSpy.mockClear()
      const expectedSearchText = 'search text'

      act(() => {
        const onChange = wrapper.find(TextInput).prop('onChange') as any
        onChange({ target: { value: expectedSearchText } })
      })

      act(() => {
        jest.advanceTimersByTime(500)
      })

      wrapper.update()

      expect(searchPatientsSpy).toHaveBeenCalledTimes(1)
      expect(searchPatientsSpy).toHaveBeenLastCalledWith(expectedSearchText, {
        sorts: [{ field: 'index', direction: 'asc' }],
      })
    })
  })
})
