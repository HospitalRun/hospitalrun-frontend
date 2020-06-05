import '../../../__mocks__/matchMediaMock'
import { Button } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../model/CarePlan'
import Patient from '../../../model/Patient'
import CarePlanTable from '../../../patients/care-plans/CarePlanTable'
import { RootState } from '../../../store'

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

    return { wrapper, history }
  }

  it('should render a table', () => {
    const { wrapper } = setup()

    const table = wrapper.find('table')
    const tableHeader = table.find('thead')
    const headers = tableHeader.find('th')
    const body = table.find('tbody')
    const columns = body.find('tr').find('td')

    expect(headers.at(0).text()).toEqual('patient.carePlan.title')
    expect(headers.at(1).text()).toEqual('patient.carePlan.startDate')
    expect(headers.at(2).text()).toEqual('patient.carePlan.endDate')
    expect(headers.at(3).text()).toEqual('patient.carePlan.status')
    expect(headers.at(4).text()).toEqual('actions.label')

    expect(columns.at(0).text()).toEqual(carePlan.title)
    expect(columns.at(1).text()).toEqual('2020-07-03')
    expect(columns.at(2).text()).toEqual('2020-07-05')
    expect(columns.at(3).text()).toEqual(carePlan.status)
    expect(columns.at(4).find('button')).toHaveLength(1)
  })

  it('should navigate to the care plan view when the view details button is clicked', () => {
    const { wrapper, history } = setup()

    const table = wrapper.find('table')
    const body = table.find('tbody')
    const columns = body.find('tr').find('td')

    act(() => {
      const onClick = columns.at(4).find(Button).prop('onClick') as any
      onClick()
    })

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/care-plans/${carePlan.id}`)
  })
})
