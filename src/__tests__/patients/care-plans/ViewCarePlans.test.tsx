import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

import ViewCarePlans from '../../../patients/care-plans/ViewCarePlans'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'

describe('View Care Plans', () => {
  const carePlan = {
    id: '123',
    title: 'Feed Harry Potter',
    description: 'Get Dobby to feed Harry Food',
    diagnosisId: '123',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: CarePlanStatus.Active,
    intent: CarePlanIntent.Proposal,
  } as CarePlan
  const patient = { id: '123', carePlans: [carePlan] as CarePlan[] } as Patient
  const setup = async () => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/careplans`)

    return render(
      <Router history={history}>
        <Route path="/patients/:id/careplans">
          <ViewCarePlans />
        </Route>
      </Router>,
    )
  }

  it('should render a care plans table with the patient id', async () => {
    setup()
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })
})
