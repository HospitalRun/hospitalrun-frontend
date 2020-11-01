import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import HistoryTab from '../../../patients/history/HistoryTab'
import HistoryTable from '../../../patients/history/HistoryTable'

import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()
const expectedPatient = ({
  id: '123',
  rev: '123',
  labs: [
    { id: '1', type: 'lab type 1' },
    { id: '2', type: 'lab type 2' },
  ],
} as unknown) as Patient

let store: any

const setup = async (
  patient = expectedPatient,
  permissions = [Permissions.ViewPatientHistory],
  route = '/patients/123/history',
) => {
  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)

  const wrapper = await mount(
    <Router history={history}>
      <Provider store={store}>
        <HistoryTab patientId={patient.id} />
      </Provider>
    </Router>,
  )
  return { wrapper: wrapper as ReactWrapper }
}

describe('HistoryTab', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  describe('patient history list', () => {
    it('should render patient history', async () => {
      const { wrapper } = await setup()

      expect(wrapper.exists(HistoryTable)).toBeTruthy()
    })
  })
})