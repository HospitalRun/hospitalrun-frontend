import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import ViewAllergy from '../../../patients/allergies/ViewAllergy'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Care Plan', () => {
  const patient = {
    id: 'patientId',
    allergies: [{ id: '123', name: 'some name' }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/allergies/${patient.allergies![0].id}`)

    await act(async () => {
      await render(
        <Router history={history}>
          <Route path="/patients/:id/allergies/:allergyId">
            <ViewAllergy />
          </Route>
        </Router>,
      )
    })
  }

  it('should render a allergy input with the correct data', async () => {
    await setup()

    const allergyName = screen.getByDisplayValue(/some name/)

    expect(allergyName).toBeInTheDocument()
  })
})
