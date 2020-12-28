import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import subDays from 'date-fns/subDays'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../page-header/title/TitleContext'
import EditPatient from '../../../patients/edit/EditPatient'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const patient = {
  id: '123',
  prefix: 'prefix',
  givenName: 'givenName',
  familyName: 'familyName',
  suffix: 'suffix',
  fullName: 'givenName familyName suffix',
  sex: 'male',
  type: 'charity',
  occupation: 'occupation',
  preferredLanguage: 'preferredLanguage',
  phoneNumbers: [{ value: '123456789', id: '789' }],
  emails: [{ value: 'email@email.com', id: '456' }],
  addresses: [{ value: 'address', id: '123' }],
  code: 'P00001',
  dateOfBirth: subDays(new Date(), 2).toISOString(),
  index: 'givenName familyName suffixP00001',
} as Patient

const setup = () => {
  jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
  jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

  const history = createMemoryHistory({ initialEntries: ['/patients/edit/123'] })
  const store = mockStore({ patient: { patient } } as any)

  // eslint-disable-next-line react/prop-types
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/patients/edit/:id">
          <titleUtil.TitleProvider>{children}</titleUtil.TitleProvider>
        </Route>
      </Router>
    </Provider>
  )

  return {
    history,
    ...render(<EditPatient />, { wrapper: Wrapper }),
  }
}

describe('Edit Patient', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should have called the useUpdateTitle hook', async () => {
    setup()

    await waitFor(() => {
      expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
    })
  })

  it('should render an edit patient form', async () => {
    setup()

    expect(await screen.findByLabelText(/patient\.prefix/i)).toBeInTheDocument()
  })

  it('should load a Patient when component loads', async () => {
    setup()

    await waitFor(() => {
      expect(PatientRepository.find).toHaveBeenCalledWith(patient.id)
    })
  })

  it('should dispatch updatePatient when save button is clicked', async () => {
    setup()

    userEvent.click(await screen.findByRole('button', { name: /patients\.updatePatient/i }))

    await waitFor(() => {
      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(patient)
    })
  })

  it('should navigate to /patients/:id when cancel is clicked', async () => {
    const { history } = setup()

    userEvent.click(await screen.findByRole('button', { name: /actions\.cancel/i }))

    await waitFor(() => {
      expect(history.location.pathname).toEqual('/patients/123')
    })
  })
})
