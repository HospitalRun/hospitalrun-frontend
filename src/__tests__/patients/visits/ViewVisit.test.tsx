import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewVisit from '../../../patients/visits/ViewVisit'
import VisitForm from '../../../patients/visits/VisitForm'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Visit', () => {
  const patient = {
    id: 'patientId',
    visits: [{ id: '123', reason: 'reason for visit' }],
  } as Patient

  const setup = () => {
    const store = mockStore({ patient: { patient }, user: { user: { id: '123' } } } as any)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/visits/${patient.visits[0].id}`)
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id/visits/:visitId">
            <ViewVisit />
          </Route>
        </Router>
      </Provider>,
    )

    return { wrapper }
  }

  it('should render the visit reason', () => {
    const { wrapper } = setup()

    expect(wrapper.find('h2').text()).toEqual(patient.visits[0].reason)
  })

  it('should render a visit form with the correct data', () => {
    const { wrapper } = setup()

    const visitForm = wrapper.find(VisitForm)
    expect(visitForm).toHaveLength(1)
    expect(visitForm.prop('visit')).toEqual(patient.visits[0])
  })
})
