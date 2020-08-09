import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import SearchPatients from '../../../patients/search/SearchPatients'
import ViewPatients from '../../../patients/search/ViewPatients'
import PatientRepository from '../../../shared/db/PatientRepository'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Patients', () => {
  const setup = () => {
    const store = mockStore({})
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <ViewPatients />
        </MemoryRouter>
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'search').mockResolvedValue([])
  })

  it('should render the search patients component', () => {
    const wrapper = setup()

    expect(wrapper.exists(SearchPatients)).toBeTruthy()
  })
})
