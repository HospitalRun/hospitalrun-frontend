import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, MemoryHistory } from 'history'
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

type CareGoalTabWrapper = (store: any, history: MemoryHistory) => React.FC

// eslint-disable-next-line react/prop-types
const TabWrapper: CareGoalTabWrapper = (store, history) => ({ children }) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/patients/:id">{children}</Route>
    </Router>
  </Provider>
)

// eslint-disable-next-line react/prop-types
const ViewWrapper: CareGoalTabWrapper = (store: any, history: MemoryHistory) => ({ children }) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/patients/:id/care-goals/:careGoalId">{children}</Route>
    </Router>
  </Provider>
)

const setup = (route: string, permissions: Permissions[], wrapper = TabWrapper) => {
  const expectedCareGoal = {
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
  const expectedPatient = { id: '123', careGoals: [expectedCareGoal] } as Patient

  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  const history = createMemoryHistory({ initialEntries: [route] })
  const store = mockStore({ user: { permissions } } as any)

  return render(<CareGoalTab />, { wrapper: wrapper(store, history) })
}

describe('Care Goals Tab', () => {
  it('should render add care goal button if user has correct permissions', async () => {
    setup('/patients/123/care-goals', [Permissions.AddCareGoal])

    expect(await screen.findByRole('button', { name: /patient.careGoal.new/i })).toBeInTheDocument()
  })

  it('should not render add care goal button if user does not have permissions', async () => {
    const { container } = setup('/patients/123/care-goals', [])

    await waitForElementToBeRemoved(container.querySelector('.css-0'))

    expect(screen.queryByRole('button', { name: /patient.careGoal.new/i })).not.toBeInTheDocument()
  })

  it('should open and close the modal when the add care goal and close buttons are clicked', async () => {
    setup('/patients/123/care-goals', [Permissions.AddCareGoal])

    userEvent.click(await screen.findByRole('button', { name: /patient.careGoal.new/i }))

    expect(screen.getByRole('dialog')).toBeVisible()

    userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.getByRole('dialog')).not.toBeVisible()
  })

  it('should render care goal table when on patients/:id/care-goals', async () => {
    const { container } = setup('/patients/123/care-goals', [Permissions.ReadCareGoal])

    await waitFor(() => {
      expect(container.querySelector('table')).toBeInTheDocument()
    })
  })

  it('should render care goal view when on patients/:id/care-goals/:careGoalId', async () => {
    setup('/patients/123/care-goals/456', [Permissions.ReadCareGoal], ViewWrapper)

    expect(await screen.findByRole('form')).toBeInTheDocument()
  })
})
