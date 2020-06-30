import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CarePlanTable from '../../../patients/care-plans/CarePlanTable'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Care Plan Table', () => {
  const carePlan: CarePlan = {
    id: 'id',
    title: 'title',
    description: 'description',
    status: CarePlanStatus.Active,
    intent: CarePlanIntent.Option,
    startDate: new Date(2020, 6, 3).toISOString(),
    endDate: new Date(2020, 6, 5).toISOString(),
    diagnosisId: 'some id',
    createdOn: new Date().toISOString(),
    note: 'note',
  }
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    carePlans: [carePlan],
  } as Patient

  const setup = () => {
    const store = mockStore({ patient: { patient } } as any)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-plans/${patient.carePlans[0].id}`)
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <CarePlanTable />
        </Router>
      </Provider>,
    )

    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a table', () => {
    const { wrapper } = setup()

    const table = wrapper.find(Table)
    const columns = table.prop('columns')
    const actions = table.prop('actions') as any
    expect(columns[0]).toEqual(
      expect.objectContaining({ label: 'patient.carePlan.title', key: 'title' }),
    )
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'patient.carePlan.startDate', key: 'startDate' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({ label: 'patient.carePlan.endDate', key: 'endDate' }),
    )
    expect(columns[3]).toEqual(
      expect.objectContaining({ label: 'patient.carePlan.status', key: 'status' }),
    )

    expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    expect(table.prop('actionsHeaderText')).toEqual('actions.label')
    expect(table.prop('data')).toEqual(patient.carePlans)
  })

  it('should navigate to the care plan view when the view details button is clicked', () => {
    const { wrapper, history } = setup()

    const tr = wrapper.find('tr').at(1)

    act(() => {
      const onClick = tr.find('button').prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/care-plans/${carePlan.id}`)
  })
})
