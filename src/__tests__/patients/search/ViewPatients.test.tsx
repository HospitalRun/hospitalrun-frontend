import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  const setup = () => {
    const store = mockStore({})

    return render(
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
    setup()
    userEvent.type(screen.getByRole('textbox'), 'Jean Luc Picard')
    expect(screen.getByRole('textbox')).toHaveValue('Jean Luc Picard')

    userEvent.clear(screen.getByRole('textbox'))
    expect(screen.queryByRole('textbox')).not.toHaveValue('Jean Luc Picard')
  })
})
