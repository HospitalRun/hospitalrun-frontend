import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import MedicationsList from '../../../patients/medications/MedicationsList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Medication from '../../../shared/model/Medication'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '1234',
} as Patient

const expectedMedications = [
  {
    id: '1234',
    medication: 'Ibuprofen',
    status: 'active',
    intent: 'order',
    priority: 'routine',
    requestedOn: new Date().toISOString(),
  },
  {
    id: '2',
    medication: 'Hydrocortisone',
    status: 'active',
    intent: 'reflex order',
    priority: 'asap',
    requestedOn: new Date().toISOString(),
  },
] as Medication[]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = async (patient = expectedPatient, medications = expectedMedications) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getMedications').mockResolvedValue(medications)
  store = mockStore({ patient, medications: { medications } } as any)

  return render(
    <Router history={history}>
      <Provider store={store}>
        <MedicationsList patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('Medications table', () => {
  it('should render patient medications table headers', async () => {
    setup()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    const headers = screen.getAllByRole('columnheader')

    expect(headers[0]).toHaveTextContent(/medications\.medication\.medication/i)
    expect(headers[1]).toHaveTextContent(/medications\.medication\.priority/i)
    expect(headers[2]).toHaveTextContent(/medications\.medication\.intent/i)
    expect(headers[3]).toHaveTextContent(/medications\.medication\.requestedOn/i)
    expect(headers[4]).toHaveTextContent(/medications\.medication\.status/i)
    expect(headers[5]).toHaveTextContent(/actions\.label/i)
  })

  it('should render patient medication list', async () => {
    setup()

    await screen.findByRole('table')

    const cells = screen.getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('Ibuprofen')
    expect(cells[1]).toHaveTextContent('routine')
    expect(cells[2]).toHaveTextContent('order')
  })

  it('render an action button', async () => {
    setup()

    await waitFor(() => {
      const row = screen.getAllByRole('row')

      expect(
        within(row[1]).getByRole('button', {
          name: /actions\.view/i,
        }),
      ).toBeInTheDocument()
    })
  })

  it('should navigate to medication view on medication click', async () => {
    setup()
    expect(await screen.findByRole('table')).toBeInTheDocument()
    userEvent.click(screen.getAllByRole('button', { name: /actions.view/i })[0])
    expect(history.location.pathname).toEqual('/medications/1234')
  })
})

describe('no patient medications', () => {
  it('should render a warning message if there are no medications', async () => {
    setup(expectedPatient, [])
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/patient.medications.warning.noMedications/i)).toBeInTheDocument()
    expect(screen.getByText(/patient.medications.noMedicationsMessage/i)).toBeInTheDocument()
  })
})
