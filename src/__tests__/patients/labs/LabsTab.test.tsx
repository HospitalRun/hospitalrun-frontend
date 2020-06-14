import '../../../__mocks__/matchMediaMock'
import * as components from '@hospitalrun/components'
import format from 'date-fns/format'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from '../../../clients/db/PatientRepository'
import Lab from '../../../model/Lab'
import Patient from '../../../model/Patient'
import Permissions from '../../../model/Permissions'
import LabsTab from '../../../patients/labs/LabsTab'
import { RootState } from '../../../store'

const expectedPatient = {
  id: '123',
} as Patient

const expectedLabs = [
  {
    id: 'labId',
    patient: '123',
    type: 'type',
    status: 'requested',
    requestedOn: new Date().toISOString(),
  } as Lab,
]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let user: any
let store: any

const setup = async (labs = expectedLabs) => {
  jest.resetAllMocks()
  user = { permissions: [Permissions.ReadPatients] }
  store = mockStore({ patient: expectedPatient, user } as any)
  jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue(labs)

  let wrapper: any
  await act(async () => {
    wrapper = await mount(
      <Router history={history}>
        <Provider store={store}>
          <LabsTab patientId={expectedPatient.id} />
        </Provider>
      </Router>,
    )
  })

  wrapper.update()
  return { wrapper: wrapper as ReactWrapper }
}

describe('Labs Tab', () => {
  it('should list the patients labs', async () => {
    const { wrapper } = await setup()

    const table = wrapper.find('table')
    const tableHeader = wrapper.find('thead')
    const tableHeaders = wrapper.find('th')
    const tableBody = wrapper.find('tbody')
    const tableData = wrapper.find('td')

    expect(table).toHaveLength(1)
    expect(tableHeader).toHaveLength(1)
    expect(tableBody).toHaveLength(1)
    expect(tableHeaders.at(0).text()).toEqual('labs.lab.type')
    expect(tableHeaders.at(1).text()).toEqual('labs.lab.requestedOn')
    expect(tableHeaders.at(2).text()).toEqual('labs.lab.status')
    expect(tableData.at(0).text()).toEqual(expectedLabs[0].type)
    expect(tableData.at(1).text()).toEqual(
      format(new Date(expectedLabs[0].requestedOn), 'yyyy-MM-dd hh:mm a'),
    )
    expect(tableData.at(2).text()).toEqual(expectedLabs[0].status)
  })

  it('should render a warning message if the patient does not have any labs', async () => {
    const { wrapper } = await setup([])

    const alert = wrapper.find(components.Alert)

    expect(alert).toHaveLength(1)
    expect(alert.prop('title')).toEqual('patient.labs.warning.noLabs')
    expect(alert.prop('message')).toEqual('patient.labs.noLabsMessage')
  })
})
