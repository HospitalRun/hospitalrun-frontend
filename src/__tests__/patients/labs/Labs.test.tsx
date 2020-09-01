import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../../patients/labs/Labs'
import LabsList from '../../../patients/labs/LabsList'
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
  permissions = [Permissions.ViewLabs],
  route = '/patients/123/labs',
) => {
  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)

  const wrapper = await mount(
    <Router history={history}>
      <Provider store={store}>
        <Labs patient={patient} />
      </Provider>
    </Router>,
  )
  return { wrapper: wrapper as ReactWrapper }
}

describe('Labs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  describe('patient labs list', () => {
    it('should render patient labs', async () => {
      const { wrapper } = await setup()

      expect(wrapper.exists(LabsList)).toBeTruthy()
    })
  })
})
