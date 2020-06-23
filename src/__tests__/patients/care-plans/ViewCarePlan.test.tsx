import '../../../__mocks__/matchMediaMock'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Patient from '../../../model/Patient'
import CarePlanForm from '../../../patients/care-plans/CarePlanForm'
import ViewCarePlan from '../../../patients/care-plans/ViewCarePlan'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Care Plan', () => {
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    carePlans: [{ id: '123', title: 'some title' }],
  } as Patient

  const setup = () => {
    const store = mockStore({ patient: { patient }, user: { user: { id: '123' } } } as any)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-plans/${patient.carePlans[0].id}`)
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id/care-plans/:carePlanId">
            <ViewCarePlan />
          </Route>
        </Router>
      </Provider>,
    )

    return { wrapper }
  }

  it('should render the care plan title', () => {
    const { wrapper } = setup()

    expect(wrapper.find('h2').text()).toEqual(patient.carePlans[0].title)
  })

  it('should render a care plan form with the correct data', () => {
    const { wrapper } = setup()

    const carePlanForm = wrapper.find(CarePlanForm)
    expect(carePlanForm).toHaveLength(1)
    expect(carePlanForm.prop('carePlan')).toEqual(patient.carePlans[0])
    expect(carePlanForm.prop('patient')).toEqual(patient)
  })
})
