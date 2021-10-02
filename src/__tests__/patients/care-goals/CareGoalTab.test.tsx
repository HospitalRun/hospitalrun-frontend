import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent, { specialChars } from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
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

const setup = (
  route: string,
  permissions: Permissions[],
  wrapper = 'tab',
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
  const path =
    wrapper === 'tab'
      ? '/patients/:id'
      : wrapper === 'view'
      ? '/patients/:id/care-goals/:careGoalId'
      : ''

  return render(
    <Provider store={store}>
      <Router history={history}>
        <Route path={path}>
          <CareGoalTab />
        </Route>
      </Router>
    </Provider>,
  )
}

describe('Care Goals Tab', () => {
  it('should not render add care goal button if user does not have permissions', async () => {
    const { container } = setup('/patients/123/care-goals', [])

    // wait for spinner to disappear
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

    setup('/patients/123/care-goals', [Permissions.AddCareGoal], 'tab', false)

    userEvent.click(await screen.findByRole('button', { name: /patient.careGoal.new/i }))

    const modal = await screen.findByRole('dialog')

    userEvent.type(
      screen.getByLabelText(/patient\.careGoal\.description/i),
      expectedCareGoal.description,
    )
    userEvent.type(
      within(screen.getByTestId('statusSelect')).getByRole('combobox'),
      `${selectAll}${expectedCareGoal.status}${arrowDown}${enter}`,
    )
    userEvent.type(
      within(screen.getByTestId('startDateDatePicker')).getByRole('textbox'),
      `${selectAll}${format(expectedCareGoal.startDate, 'MM/dd/yyyy')}${enter}`,
    )
    userEvent.type(
      within(screen.getByTestId('dueDateDatePicker')).getByRole('textbox'),
      `${selectAll}${format(expectedCareGoal.dueDate, 'MM/dd/yyyy')}${enter}`,
    )

    userEvent.click(within(modal).getByRole('button', { name: /patient.careGoal.new/i }))

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      },
      {
        timeout: 3000,
      },
    )

    const cells = await screen.findAllByRole('cell')
    expect(cells[0]).toHaveTextContent(expectedCareGoal.description)
    expect(cells[1]).toHaveTextContent(format(expectedCareGoal.startDate, 'yyyy-MM-dd'))
    expect(cells[2]).toHaveTextContent(format(expectedCareGoal.dueDate, 'yyyy-MM-dd'))
    expect(cells[3]).toHaveTextContent(expectedCareGoal.status)
  }, 50000)

  it('should open and close the modal when the add care goal and close buttons are clicked', async () => {
    setup('/patients/123/care-goals', [Permissions.AddCareGoal])

    userEvent.click(await screen.findByRole('button', { name: /patient.careGoal.new/i }))

    expect(screen.getByRole('dialog')).toBeVisible()

    userEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.getByRole('dialog')).not.toBeVisible()
  })

  it('should render care goal table when on patients/:id/care-goals', async () => {
    setup('/patients/123/care-goals', [Permissions.ReadCareGoal])

    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('should render care goal view when on patients/:id/care-goals/:careGoalId', async () => {
    setup('/patients/123/care-goals/456', [Permissions.ReadCareGoal], 'view')

    expect(await screen.findByLabelText('care-goal-form')).toBeInTheDocument()
  })
})
