import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import AllergiesList from '../../../patients/allergies/AllergiesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Allergy from '../../../shared/model/Allergy'
import Patient from '../../../shared/model/Patient'

describe('Allergies list', () => {
  const setup = async (allergies: Allergy[]) => {
    const mockPatient = { id: '123', allergies } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${mockPatient.id}/allergies`)
    await act(async () => {
      await render(
        <Router history={history}>
          <AllergiesList patientId={mockPatient.id} />
        </Router>,
      )
    })
    return { history }
  }

  it('should render a list of allergies', async () => {
    const expectedAllergies = [{ id: '456', name: 'some name' }]
    await setup(expectedAllergies)
    const listItems = screen.getAllByRole('button')
    expect(listItems).toHaveLength(expectedAllergies.length)
    expect(screen.getByText(expectedAllergies[0].name)).toBeInTheDocument()
  })

  it('should display a warning when no allergies are present', async () => {
    const expectedAllergies: Allergy[] = []
    await setup(expectedAllergies)
    expect(screen.getByRole('alert')).toHaveTextContent(/patient\.allergies\.warning.noAllergies/i)
    expect(screen.getByRole('alert')).toHaveTextContent(/patient\.allergies\.addAllergyAbove/i)
  })

  it('should navigate to the allergy when the allergy is clicked', async () => {
    const expectedAllergies = [{ id: '456', name: 'some name' }]
    const { history } = await setup(expectedAllergies)
    const listItems = screen.getAllByRole('button')
    userEvent.click(listItems[0])
    expect(history.location.pathname).toEqual(`/patients/123/allergies/${expectedAllergies[0].id}`)
  })
})
