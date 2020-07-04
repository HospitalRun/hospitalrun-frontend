import * as components from '@hospitalrun/components'
import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import LabsTab from '../../../patients/labs/LabsTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

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

    const table = wrapper.find(Table)
    const columns = table.prop('columns')
    const actions = table.prop('actions') as any
    expect(columns[0]).toEqual(expect.objectContaining({ label: 'labs.lab.type', key: 'type' }))
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'labs.lab.requestedOn', key: 'requestedOn' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({
        label: 'labs.lab.status',
        key: 'status',
      }),
    )

    expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    expect(table.prop('actionsHeaderText')).toEqual('actions.label')
    expect(table.prop('data')).toEqual(expectedLabs)
  })

  it('should render a warning message if the patient does not have any labs', async () => {
    const { wrapper } = await setup([])

    const alert = wrapper.find(components.Alert)

    expect(alert).toHaveLength(1)
    expect(alert.prop('title')).toEqual('patient.labs.warning.noLabs')
    expect(alert.prop('message')).toEqual('patient.labs.noLabsMessage')
  })
})
