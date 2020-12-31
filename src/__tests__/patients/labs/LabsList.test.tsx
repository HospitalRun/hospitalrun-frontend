import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import LabsList from '../../../patients/labs/LabsList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '1234',
} as Patient

const expectedLabs = [
  {
    id: '456',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'Dr Strange',
    type: 'Blood type',
  },
  {
    id: '123',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    requestedBy: 'Dr Meredith Gray',
    type: 'another type ',
  },
] as Lab[]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = async (patient = expectedPatient, labs = expectedLabs) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue(labs)
  store = mockStore({ patient, labs: { labs } } as any)

  return render(
    <Router history={history}>
      <Provider store={store}>
        <LabsList patient={patient} />
      </Provider>
    </Router>,
  )
}

describe('Table', () => {
  it('should render a list of labs', async () => {
    await setup()
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)

    expect(
      screen.getByRole('columnheader', {
        name: /labs\.lab\.type/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('columnheader', {
        name: /labs\.lab\.requestedon/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('columnheader', {
        name: /labs\.lab\.status/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('columnheader', {
        name: /actions\.label/i,
      }),
    ).toBeInTheDocument()
  })
  it('should navigate to lab view on lab click', async () => {
    let row: any
    await setup()

    await waitFor(() => {
      row = screen.getByRole('row', {
        name: /blood type 2020-02-01 09:00 am actions\.view/i,
      })
    })

    await waitFor(() =>
      userEvent.click(
        within(row).getByRole('button', {
          name: /actions\.view/i,
        }),
      ),
    )

    expect(history.location.pathname).toEqual('/labs/456')
  })
})

describe('no patient labs', () => {
  it('should render a warning message if there are no labs', async () => {
    await setup(expectedPatient, [])

    await waitFor(() => {
      expect(screen.getByText(/patient\.labs\.warning\.noLabs/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/patient\.labs\.noLabsMessage/i))
    })
  })
})
