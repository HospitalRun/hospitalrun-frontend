import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CarePlanTab from '../../../patients/care-plans/CarePlanTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Care Plan Tab', () => {
  const carePlan = {
    id: '679',
    title: 'some title',
    description: 'some description',
    diagnosisId: '123',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    note: '',
    status: CarePlanStatus.Active,
    intent: CarePlanIntent.Proposal,
    createdOn: new Date().toISOString(),
  }

  const patient = { id: '124', carePlans: [carePlan] as CarePlan[] } as Patient

  const setup = async (route: string, permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const store = mockStore({ user: { permissions } } as any)
    const history = createMemoryHistory()
    history.push(route)

    return render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id/care-plans">
            <CarePlanTab />
          </Route>
        </Router>
      </Provider>,
    )
  }

  it('should render an add care plan button if user has correct permissions', async () => {
    setup('/patients/123/care-plans', [Permissions.AddCarePlan])

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.carePlan\.new/i })).toBeInTheDocument()
    })
  })

  it('should open the add care plan modal on click', async () => {
    setup('/patients/123/care-plans', [Permissions.AddCarePlan])

    userEvent.click(await screen.findByRole('button', { name: /patient\.carePlan\.new/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('should close the modal when the close button is clicked', async () => {
    setup('/patients/123/care-plans', [Permissions.AddCarePlan])

    userEvent.click(await screen.findByRole('button', { name: /patient\.carePlan\.new/i }))

    expect(screen.getByRole('dialog')).toBeVisible()

    userEvent.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    )
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeVisible()
    })
  })

  it('should not render care plan button if user does not have permissions', async () => {
    setup('/patients/123/care-plans', [])

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /patient\.carePlan\.new/i }),
      ).not.toBeInTheDocument()
    })
  })

  it('should render the care plans table when on /patient/:id/care-plans', async () => {
    setup('/patients/123/care-plans', [Permissions.ReadCarePlan])

    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('should render the care plan view when on /patient/:id/care-plans/:carePlanId', async () => {
    setup('/patients/123/care-plans/679', [Permissions.ReadCarePlan])

    expect(await screen.findByRole('form')).toBeInTheDocument()
  })
})
