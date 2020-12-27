import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import VisitTab from '../../../patients/visits/VisitTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import Visit, { VisitStatus } from '../../../shared/model/Visit'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Visit Tab', () => {
  const visit = {
    id: '456',
    startDateTime: new Date(2020, 6, 3).toISOString(),
    endDateTime: new Date(2020, 6, 5).toISOString(),
    type: 'standard type',
    status: VisitStatus.Arrived,
    reason: 'some reason',
    location: 'main building',
  } as Visit

  const patient = {
    id: '123',
    visits: [visit],
  } as Patient

  const setup = (route: string, permissions: Permissions[]) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const store = mockStore({ user: { permissions } } as any)
    const history = createMemoryHistory()
    history.push(route)

    return {
      history,
      ...render(
        <Provider store={store}>
          <Router history={history}>
            <VisitTab patientId={patient.id} />
          </Router>
        </Provider>,
      ),
    }
  }

  it('should render an add visit button if user has correct permissions', () => {
    setup(`/patients/${patient.id}/visits`, [Permissions.AddVisit])

    expect(screen.queryByRole('button', { name: /patient.visits.new/i })).toBeInTheDocument()
  })

  it('should open the add visit modal on click', () => {
    setup(`/patients/${patient.id}/visits`, [Permissions.AddVisit])

    const addNewButton = screen.getByRole('button', { name: /patient.visits.new/i })
    userEvent.click(addNewButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog').classList).toContain('show')
  })

  it('should close the modal when the close button is clicked', async () => {
    setup(`/patients/${patient.id}/visits`, [Permissions.AddVisit])

    const addNewButton = screen.getByRole('button', { name: /patient.visits.new/i })
    userEvent.click(addNewButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog').classList).toContain('show')

    const closeButton = screen.getByRole('button', { name: /close/i })

    userEvent.click(closeButton)
    expect(screen.getByRole('dialog').classList).not.toContain('show')
  })

  it('should not render visit button if user does not have permissions', () => {
    setup(`/patients/${patient.id}/visits`, [])

    expect(screen.queryByRole('button', { name: /patient.visits.new/i })).not.toBeInTheDocument()
  })

  it('should render the visits table when on /patient/:id/visits', async () => {
    setup(`/patients/${patient.id}/visits`, [Permissions.ReadVisits])

    await waitFor(() => {
      expect(screen.queryByRole('table')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('columnheader', { name: /patient.visits.startDateTime/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /patient.visits.endDateTime/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient.visits.type/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient.visits.status/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient.visits.reason/i })).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /patient.visits.location/i }),
    ).toBeInTheDocument()
  })

  it('should render the visit view when on /patient/:id/visits/:visitId', async () => {
    setup(`/patients/${patient.id}/visits/${visit.id}`, [Permissions.ReadVisits])

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: visit.reason })).toBeInTheDocument()
    })
  })
})
