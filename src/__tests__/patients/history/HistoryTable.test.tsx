import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import HistoryTable from '../../../patients/history/HistoryTable'
import * as HistoryRecordsMapper from '../../../patients/history/mappers/HistoryRecordsMapper'
import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../../shared/model/Appointment'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import { PatientHistoryRecord, HistoryRecordType } from '../../../shared/model/PatientHistoryRecord'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()
const expectedPatient = {
  id: '123',
} as Patient

const mockLabs = [
  {
    id: '123',
    code: 'dummy',
    patient: 'dummy patient',
    type: 'emergency incident',
    status: 'completed',
    requestedOn: '01/01/2021',
    completedOn: '02/01/2021',
  },
] as Lab[]
const mockAppts = [
  {
    id: '234',
    startDateTime: '01/04/2021',
    endDateTime: '01/05/2021',
    patient: 'dummy patient',
    reason: 'high blood pressure',
    type: 'annual checkup',
  },
] as Appointment[]

const mockHistoryRecords = [
  {
    date: new Date('01/01/2021'),
    type: HistoryRecordType.LAB,
    info: 'Requested - emergency incident',
    recordId: '123',
    id: 'requestedLab123',
  },
  {
    date: new Date('02/01/2021'),
    type: HistoryRecordType.APPOINTMENT,
    info: 'Started - emergency accident',
    recordId: '456',
    id: 'startedAppt456',
  },
] as PatientHistoryRecord[]

let store: any
const setup = async (
  patient = expectedPatient,
  permissions = [Permissions.ViewPatientHistory],
  route = '/patients/123/history',
) => {
  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)

  return render(
    <Router history={history}>
      <Provider store={store}>
        <HistoryTable patientId={patient.id} />
      </Provider>
    </Router>,
  )
}
describe('HistoryTable', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue(mockLabs)
    jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue(mockAppts)
  })

  describe('patient history table', () => {
    it('should render the history table headers', async () => {
      setup()
      jest.spyOn(HistoryRecordsMapper, 'mapHistoryRecords').mockReturnValue(mockHistoryRecords)
      expect(await screen.findByRole('table')).toBeInTheDocument()
      const headers = screen.getAllByRole('columnheader')
      expect(headers[0]).toHaveTextContent(/patient\.history\.eventDate/i)
      expect(headers[1]).toHaveTextContent(/patient\.history\.recordType/i)
      expect(headers[2]).toHaveTextContent(/patient\.history\.information/i)
      expect(headers[3]).toHaveTextContent(/actions\.label/i)
    })

    it('should render correct patient histories', async () => {
      setup()
      jest.spyOn(HistoryRecordsMapper, 'mapHistoryRecords').mockReturnValue(mockHistoryRecords)

      await screen.findByRole('table')

      const cells = screen.getAllByRole('cell')
      expect(cells[0]).toHaveTextContent('2021-01-01 12:00 AM')
      expect(cells[1]).toHaveTextContent(HistoryRecordType.LAB)
      expect(cells[2]).toHaveTextContent('Requested - emergency incident')
    })

    it('render an action button', async () => {
      setup()

      await waitFor(() => {
        const row = screen.getAllByRole('row')

        expect(
          within(row[1]).getByRole('button', {
            name: /actions\.view/i,
          }),
        ).toBeInTheDocument()
      })
    })

    it('should navigate to lab record on lab history click', async () => {
      setup()
      jest.spyOn(HistoryRecordsMapper, 'mapHistoryRecords').mockReturnValue(mockHistoryRecords)
      expect(await screen.findByRole('table')).toBeInTheDocument()
      userEvent.click(screen.getAllByRole('button', { name: /actions.view/i })[0])
      expect(history.location.pathname).toEqual('/labs/123')
    })

    it('should navigate to appointment record on appointment history click', async () => {
      setup()
      jest.spyOn(HistoryRecordsMapper, 'mapHistoryRecords').mockReturnValue(mockHistoryRecords)
      expect(await screen.findByRole('table')).toBeInTheDocument()
      userEvent.click(screen.getAllByRole('button', { name: /actions.view/i })[1])
      expect(history.location.pathname).toEqual('/appointments/456')
    })
  })

  describe('no patient histories', () => {
    it('should render a warning message if there are no histories', async () => {
      setup()
      jest.spyOn(HistoryRecordsMapper, 'mapHistoryRecords').mockReturnValue([])
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/patient.history.noHistoryTitle/i)).toBeInTheDocument()
      expect(screen.getByText(/patient.history.noHistoryMessage/i)).toBeInTheDocument()
    })
  })
})
