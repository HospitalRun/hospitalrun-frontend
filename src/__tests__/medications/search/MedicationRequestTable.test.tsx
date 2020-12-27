import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRequestTable from '../../../medications/search/MedicationRequestTable'
import MedicationRepository from '../../../shared/db/MedicationRepository'
import Medication from '../../../shared/model/Medication'

describe('Medication Request Table', () => {
  const setup = async (
    givenSearchRequest: MedicationSearchRequest = { text: '', status: 'all' },
    givenMedications: Medication[] = [],
  ) => {
    jest.resetAllMocks()
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue(givenMedications)
    const history = createMemoryHistory()

    return {
      history,
      ...render(
        <Router history={history}>
          <MedicationRequestTable searchRequest={givenSearchRequest} />
        </Router>,
      ),
    }
  }

  it('should render a table with the correct columns', async () => {
    const { container } = await setup()

    await waitFor(() => {
      expect(container.querySelector('table')).toBeInTheDocument()
    })
    const columns = container.querySelectorAll('th')

    expect(columns[0]).toHaveTextContent(/medications.medication.medication/i)
    expect(columns[1]).toHaveTextContent(/medications.medication.priority/i)
    expect(columns[2]).toHaveTextContent(/medications.medication.intent/i)
    expect(columns[3]).toHaveTextContent(/medications.medication.requestedOn/i)
    expect(columns[4]).toHaveTextContent(/medications.medication.status/i)
    expect(columns[5]).toHaveTextContent(/actions.label/i)
  })

  it('should fetch medications and display it', async () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: 'someText', status: 'draft' }
    const expectedMedicationRequests: Medication[] = [
      {
        id: 'someId',
        medication: expectedSearchRequest.text,
        status: expectedSearchRequest.status,
      } as Medication,
    ]
    const { container } = await setup(expectedSearchRequest, expectedMedicationRequests)

    await waitFor(() => {
      expect(container.querySelector('table')).toBeInTheDocument()
    })
    expect(screen.getByText(expectedSearchRequest.text)).toBeInTheDocument()
    expect(screen.getByText(expectedSearchRequest.status)).toBeInTheDocument()
  })

  it('should navigate to the medication when the view button is clicked', async () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: 'someText', status: 'draft' }
    const expectedMedicationRequests: Medication[] = [{ id: 'someId' } as Medication]
    const { container, history } = await setup(expectedSearchRequest, expectedMedicationRequests)

    await waitFor(() => {
      expect(container.querySelector('table')).toBeInTheDocument()
    })
    userEvent.click(screen.getByRole('button', { name: /actions.view/i }))

    expect(history.location.pathname).toEqual(`/medications/${expectedMedicationRequests[0].id}`)
  })
})
