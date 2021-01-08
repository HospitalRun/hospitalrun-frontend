import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent, { specialChars } from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import CareGoalTab from '../../../patients/care-goals/CareGoalTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal, { CareGoalStatus } from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const { selectAll, arrowDown, enter } = specialChars

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

const setup = (
  route: string,
  permissions: Permissions[],
  wrapper = TabWrapper,
  includeCareGoal = true,
) => {
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
  const expectedPatient = {
    id: '123',
    careGoals: includeCareGoal ? [expectedCareGoal] : [],
  } as Patient

  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  const history = createMemoryHistory({ initialEntries: [route] })
  const store = mockStore({ user: { permissions } } as any)

  return render(<CareGoalTab />, { wrapper: wrapper(store, history) })
}

describe('Care Goals Tab', () => {
  it('should not render add care goal button if user does not have permissions', async () => {
    const { container } = setup('/patients/123/care-goals', [])

    await waitForElementToBeRemoved(container.querySelector('.css-0'))

    expect(screen.queryByRole('button', { name: /patient.careGoal.new/i })).not.toBeInTheDocument()
  })

  it('should be able to create a new care goal if user has permissions', async () => {
    const expectedCareGoal = {
      description: 'some description',
      status: CareGoalStatus.Accepted,
      startDate: new Date('2020-01-01'),
      dueDate: new Date('2020-02-01'),
    }

    setup('/patients/123/care-goals', [Permissions.AddCareGoal], TabWrapper, false)

    userEvent.click(await screen.findByRole('button', { name: /patient.careGoal.new/i }))

    const modal = await screen.findByRole('dialog')

    userEvent.type(within(modal).getAllByRole('textbox')[0], expectedCareGoal.description)
    userEvent.type(
      within(modal).getAllByRole('combobox')[1],
      `${selectAll}${expectedCareGoal.status}${arrowDown}${enter}`,
    )
    userEvent.type(
      within(modal).getAllByRole('textbox')[4],
      `${selectAll}${format(expectedCareGoal.startDate, 'MM/dd/yyyy')}${enter}`,
    )
    userEvent.type(
      within(modal).getAllByRole('textbox')[5],
      `${selectAll}${format(expectedCareGoal.dueDate, 'MM/dd/yyyy')}${enter}`,
    )

    userEvent.click(within(modal).getByRole('button', { name: /patient.careGoal.new/i }))

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      },
      // {
      //   timeout: 3000,
      // },
    )

    expect(
      await screen.findByRole('cell', { name: expectedCareGoal.description }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('cell', { name: expectedCareGoal.status })).toBeInTheDocument()
    expect(
      await screen.findByRole('cell', { name: format(expectedCareGoal.startDate, 'yyyy-MM-dd') }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('cell', { name: format(expectedCareGoal.dueDate, 'yyyy-MM-dd') }),
    ).toBeInTheDocument()
  }, 30000)

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
