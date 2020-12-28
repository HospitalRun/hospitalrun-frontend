import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CareGoalTab from '../../../patients/care-goals/CareGoalTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Care Goals Tab', () => {
  const careGoal = {
    id: '456',
    status: 'accepted',
    startDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    achievementStatus: 'improving',
    priority: 'high',
    description: 'test description',
    createdOn: new Date().toISOString(),
    note: '',
  } as CareGoal
  const patient = { id: '123', careGoals: [careGoal] as CareGoal[] } as Patient

  const setup = async (route: string, permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const store = mockStore({ user: { permissions } } as any)
    const history = createMemoryHistory()
    history.push(route)

    return render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id/care-goals">
            <CareGoalTab />
          </Route>
        </Router>
      </Provider>,
    )
  }

  it('should render add care goal button if user has correct permissions', async () => {
    setup('patients/123/care-goals', [Permissions.AddCareGoal])
    expect(await screen.findByRole('button', { name: /patient.careGoal.new/i })).toBeInTheDocument()
  })

  it('should not render add care goal button if user does not have permissions', async () => {
    setup('patients/123/care-goals', [])
    expect(screen.queryByRole('button', { name: /patient.careGoal.new/i })).not.toBeInTheDocument()
  })

  it('should open the add care goal modal on click', async () => {
    setup('patients/123/care-goals', [Permissions.AddCareGoal])
    userEvent.click(await screen.findByRole('button', { name: /patient.careGoal.new/i }))
    expect(screen.getByRole('dialog')).toBeVisible()
  })

  it('should close the modal when the close button is clicked', async () => {
    setup('patients/123/care-goals', [Permissions.AddCareGoal])
    userEvent.click(await screen.findByRole('button', { name: /patient.careGoal.new/i }))
    expect(screen.getByRole('dialog')).toBeVisible()
    userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.getByRole('dialog')).not.toBeVisible()
  })

  it('should render care goal table when on patients/123/care-goals', async () => {
    const { container } = await setup('patients/123/care-goals', [Permissions.ReadCareGoal])
    await waitFor(() => {
      expect(container.querySelector('table')).toBeInTheDocument()
    })
  })

  it('should render care goal view when on patients/123/care-goals/456', async () => {
    setup('patients/123/care-goals/456', [Permissions.ReadCareGoal])
    expect(await screen.findByRole('form')).toBeInTheDocument()
  })
})
