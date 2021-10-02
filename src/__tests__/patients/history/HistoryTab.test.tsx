import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import HistoryTab from '../../../patients/history/HistoryTab'
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
        <HistoryTab patientId={patient.id} />
      </Provider>
    </Router>,
  )
}

describe('HistoryTab', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue(mockLabs)
    jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue(mockAppts)
    jest.spyOn(HistoryRecordsMapper, 'mapHistoryRecords').mockReturnValue(mockHistoryRecords)
  })

  describe('patient history list', () => {
    it('should render patient history', async () => {
      setup()
      expect(await screen.findByRole('table')).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: mockHistoryRecords[0].info })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: mockHistoryRecords[1].info })).toBeInTheDocument()
    })
  })
})
