import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewAllergy from '../../../patients/allergies/ViewAllergy'
import PatientRepository from '../../../shared/db/PatientRepository'
import Allergy from '../../../shared/model/Allergy'
import Patient from '../../../shared/model/Patient'

describe('ViewAllergy', () => {
  const patient = {
    id: 'patientId',
    allergies: [{ id: '123', name: 'cats' }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/allergies/${(patient.allergies as Allergy[])[0].id}`)

    return render(
      <Router history={history}>
        <Route path="/patients/:id/allergies/:allergyId">
          <ViewAllergy />
        </Route>
      </Router>,
    )
  }

  it('should render an allergy input with the correct data', async () => {
    setup()

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /patient.allergies.allergyName/i }),
      ).toHaveDisplayValue('cats')
    })
  })
})
