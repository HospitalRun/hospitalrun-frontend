import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewAllergy from '../../../patients/allergies/ViewAllergy'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Care Plan', () => {
  const patient = {
    id: 'patientId',
    allergies: [{ id: '123', name: 'some name' }],
  } as Patient

  const setup = () => {
    const store = mockStore({ patient: { patient }, user: { user: { id: '123' } } } as any)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/allergies/${patient.allergies![0].id}`)
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id/allergies/:allergyId">
            <ViewAllergy />
          </Route>
        </Router>
      </Provider>,
    )

    return { wrapper }
  }

  it('should render a allergy input with the correct data', () => {
    const { wrapper } = setup()

    const allergyName = wrapper.find(TextInputWithLabelFormGroup)
    expect(allergyName).toHaveLength(1)
    expect(allergyName.prop('value')).toEqual(patient.allergies![0].name)
  })
})
