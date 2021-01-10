import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import AllergiesList from '../../../patients/allergies/AllergiesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Allergy from '../../../shared/model/Allergy'
import Patient from '../../../shared/model/Patient'

describe('Allergies list', () => {
  const setup = (allergies: Allergy[]) => {
    const mockPatient = { id: '123', allergies } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${mockPatient.id}/allergies`)

    return {
      history,
      ...render(
        <Router history={history}>
          <AllergiesList patientId={mockPatient.id} />
        </Router>,
      ),
    }
  }

  it('should render a list of allergies', async () => {
    const expectedAllergies = [{ id: '456', name: 'some name' }]
    setup(expectedAllergies)

    const listItems = await screen.findAllByRole('button')
    expect(listItems).toHaveLength(expectedAllergies.length)
    expect(screen.getByText(expectedAllergies[0].name)).toBeInTheDocument()
  })

  it('should display a warning when no allergies are present', async () => {
    const expectedAllergies: Allergy[] = []
    setup(expectedAllergies)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /patient\.allergies\.warning.noAllergies/i,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/patient\.allergies\.addAllergyAbove/i)
  })

  it('should navigate to the allergy when the allergy is clicked', async () => {
    const expectedAllergies = [{ id: '456', name: 'some name' }]
    const { history } = setup(expectedAllergies)

    const listItems = await screen.findAllByRole('button')
    userEvent.click(listItems[0])
    expect(history.location.pathname).toEqual(`/patients/123/allergies/${expectedAllergies[0].id}`)
  })
})
