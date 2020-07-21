import { List, ListItem } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AllergiesList from '../../../patients/allergies/AllergiesList'
import Allergy from '../../../shared/model/Allergy'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Allergies list', () => {
  const allergy: Allergy = {
    id: 'id',
    name: 'name',
  }
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    allergies: [allergy],
  } as Patient

  const setup = () => {
    const store = mockStore({ patient: { patient } } as any)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/allergies/${patient.allergies![0].id}`)
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <AllergiesList />
        </Router>
      </Provider>,
    )
    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a list', () => {
    const allergies = patient.allergies as Allergy[]
    const { wrapper } = setup()
    const list = wrapper.find(List)
    const listItems = wrapper.find(ListItem)

    expect(list).toHaveLength(1)
    expect(listItems).toHaveLength(allergies.length)
  })

  it('should navigate to the allergy view when the allergy is clicked', () => {
    const { wrapper, history } = setup()
    const item = wrapper.find(ListItem)
    act(() => {
      const onClick = item.prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/allergies/${allergy.id}`)
  })
})
