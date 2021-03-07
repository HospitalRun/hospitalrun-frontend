import * as components from '@hospitalrun/components'
import { Toaster } from '@hospitalrun/components'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../page-header/title/TitleContext'
import NewPatient from '../../../patients/new/NewPatient'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('New Patient', () => {
  const patient = {
    id: '123',
    givenName: 'givenName',
    fullName: 'givenName',
    familyName: 'familyName',
    sex: 'male',
    dateOfBirth: '01/01/2020',
  } as Patient

  let history: any
  let store: MockStore

  const setup = (error?: any) => {
    jest.spyOn(PatientRepository, 'save').mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient: {} as Patient, createError: error } } as any)

    history.push('/patients/new')

    return render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/new">
            <TitleProvider>
              <NewPatient />
            </TitleProvider>
          </Route>
        </Router>
        <Toaster draggable hideProgressBar />
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a general information form', async () => {
    setup()
    expect(screen.getByText(/patient\.basicInformation/i))
  })

  it('should pass the error object to general information', async () => {
    const expectedError = { message: 'some message' }
    setup(expectedError)
    expect(screen.getByRole('alert')).toHaveTextContent(expectedError.message)
  })

  it('should dispatch createPatient when save button is clicked', async () => {
    setup()
    userEvent.type(screen.getByLabelText(/patient\.givenName/i), patient.givenName as string)
    userEvent.click(screen.getByRole('button', { name: /patients\.createPatient/i }))
    expect(PatientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: patient.fullName, givenName: patient.givenName }),
    )
  })

  // TODO: https://github.com/HospitalRun/hospitalrun-frontend/pull/2516#issuecomment-753378004
  // it('should reveal modal (return true) when save button is clicked if an existing patient has the same information', async () => {
  //   const { container } = setup()
  //   userEvent.type(screen.getByLabelText(/patient\.givenName/i), patient.givenName as string)
  //   userEvent.type(screen.getByLabelText(/patient\.familyName/i), patient.familyName as string)
  //   userEvent.type(
  //     screen.getAllByPlaceholderText('-- Choose --')[0],
  //     `${patient.sex}{arrowdown}{enter}`,
  //   )
  //   userEvent.type(
  //     (container.querySelector('.react-datepicker__input-container') as HTMLInputElement)
  //       .children[0],
  //     '01/01/2020',
  //   )
  //   userEvent.click(screen.getByRole('button', { name: /patients\.createPatient/i }))
  //   expect(await screen.findByRole('alert')).toBeInTheDocument()
  //   expect(screen.getByText(/patients.duplicatePatientWarning/i)).toBeInTheDocument()
  // })

  it('should navigate to /patients/:id and display a message after a new patient is successfully created', async () => {
    jest.spyOn(components, 'Toast').mockImplementation(jest.fn())
    const { container } = setup()
    userEvent.type(screen.getByLabelText(/patient\.givenName/i), patient.givenName as string)
    userEvent.click(screen.getByRole('button', { name: /patients\.createPatient/i }))
    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${patient.id}`)
    })
    await waitFor(() => {
      expect(container.querySelector('.Toastify')).toBeInTheDocument()
    })
  })

  it('should navigate to /patients when cancel is clicked', async () => {
    setup()
    userEvent.click(screen.getByRole('button', { name: /actions.cancel/i }))
    await waitFor(() => {
      expect(history.location.pathname).toEqual('/patients')
    })
  })
})
