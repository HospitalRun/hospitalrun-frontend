import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewCarePlan from '../../../patients/care-plans/ViewCarePlan'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'

describe('View Care Plan', () => {
  const carePlan = {
    id: '123',
    title: 'Feed Harry Potter',
  } as CarePlan
  const patient = {
    id: '023',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    carePlans: [carePlan],
  } as Patient

  const setup = async () => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-plans/${patient.carePlans[0].id}`)

    return render(
      <Router history={history}>
        <Route path="/patients/:id/care-plans/:carePlanId">
          <ViewCarePlan />
        </Route>
      </Router>,
    )
  }

  it('should render the care plan title', async () => {
    setup()

    expect(await screen.findByRole('heading', { name: carePlan.title })).toBeInTheDocument()
  })
})
