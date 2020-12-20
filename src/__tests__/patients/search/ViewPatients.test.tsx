import { render as rtlRender, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { TitleProvider } from '../../../page-header/title/TitleContext'
import ViewPatients from '../../../patients/search/ViewPatients'
import PatientRepository from '../../../shared/db/PatientRepository'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Patients', () => {
  const render = () => {
    const store = mockStore({})

    return rtlRender(
      <Provider store={store}>
        <MemoryRouter>
          <TitleProvider>
            <ViewPatients />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'search').mockResolvedValue([])
  })

  it('should render the search patients component', () => {
    render()

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
