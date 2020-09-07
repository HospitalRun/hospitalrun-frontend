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

import LabsList from '../../../patients/labs/LabsList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '1234',
} as Patient

const expectedLabs = [
  {
    id: '456',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'someone',
    type: 'lab type',
  },
  {
    id: '123',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'someone',
    type: 'lab type',
  },
] as Lab[]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = async (patient = expectedPatient, labs = expectedLabs) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue(labs)
  store = mockStore({ patient, labs: { labs } } as any)

  let wrapper: any

  await act(async () => {
    wrapper = await mount(
      <Router history={history}>
        <Provider store={store}>
          <LabsList patient={patient} />
        </Provider>
      </Router>,
    )
  })

  wrapper.update()

  return { wrapper: wrapper as ReactWrapper }
}

describe('LabsList', () => {
  describe('Table', () => {
    it('should render a list of labs', async () => {
      const { wrapper } = await setup()

      const table = wrapper.find(Table)

      const columns = table.prop('columns')
      const actions = table.prop('actions') as any

      expect(table).toHaveLength(1)

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

    it('should navigate to lab view on lab click', async () => {
      const { wrapper } = await setup()
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').at(0).prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual('/labs/456')
    })
  })

  describe('no patient labs', () => {
    it('should render a warning message if there are no labs', async () => {
      const { wrapper } = await setup(expectedPatient, [])
      const alert = wrapper.find(components.Alert)

      expect(alert).toHaveLength(1)
      expect(alert.prop('title')).toEqual('patient.labs.warning.noLabs')
      expect(alert.prop('message')).toEqual('patient.labs.noLabsMessage')
    })
  })
})
