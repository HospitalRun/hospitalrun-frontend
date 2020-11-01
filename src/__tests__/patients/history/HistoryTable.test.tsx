import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import HistoryTable from '../../../patients/history/HistoryTable'

import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../../shared/model/Appointment'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import { HistoryRecordType, PatientHistoryRecord } from '../../../shared/model/PatientHistoryRecord'
import { RootState } from '../../../shared/store'

const expectedLab: Lab = 
  {
    id: '123',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1).toISOString(),
    requestedBy: 'someone',
    type: 'lab type',
    code: '',
    status: 'requested',
    createdAt: '',
    updatedAt: ''
  }

const expectedPatient = {
    id: '1234'
  } as Patient

const expectedAppointment: Appointment = {
  id: 'id',
  startDateTime: new Date(2020, 6, 3).toISOString(),
  endDateTime: new Date(2020, 6, 5).toISOString(),
  createdAt: new Date(2020, 6, 1).toISOString(),
  updatedAt: new Date(2020, 6, 1).toISOString(),
  type: 'standard type',
  reason: 'some reason',
  location: 'main building',
  patient: expectedPatient.id,
  rev: ''
}

const expectedPatientHistory: PatientHistoryRecord[] = 
[{
  date: new Date(expectedAppointment.startDateTime),
  type: HistoryRecordType.APPOINTMENT,
  info: expectedAppointment.type,
  recordId: expectedAppointment.id,
}, {
  date: new Date(expectedLab.requestedOn),
  type: HistoryRecordType.LAB,
  info: expectedLab.type,
  recordId: expectedLab.id
}]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = async (patient = expectedPatient, lab = expectedLab, appointment = expectedAppointment) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue([lab])
  jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue([appointment])
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
  history.push(`/patients/${patient.id}/history`)
  store = mockStore({ patient, labs: [lab], appointments: [appointment]  } as any)

  let wrapper: any

  await act(async () => {
    wrapper = await mount(
      <Router history={history}>
        <Provider store={store}>
          <HistoryTable patientId={patient.id} />
        </Provider>
      </Router>,
    )
  })

  wrapper.update()

  return { wrapper: wrapper as ReactWrapper }
}

describe('HistoryTable', () => {
  describe('Table', () => {
    it('should render a list of history records', async () => {
      const { wrapper } = await setup()

      const table = wrapper.find(Table)

      const columns = table.prop('columns')
      const actions = table.prop('actions') as any

      expect(table).toHaveLength(1)

      expect({label: columns[0].label, key: columns[0].key}).toEqual({ label: 'patient.history.entryDate', key: 'date' })
      expect(columns[1]).toEqual({ label: 'patient.history.recordType', key: 'type' })
      expect(columns[2]).toEqual({ label: 'patient.history.information', key: 'info' })
      expect(actions[0].label).toEqual('actions.view')
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual(expectedPatientHistory)
    })

    it('should navigate to appointment view on history record click', async () => {
      const { wrapper } = await setup()
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').at(0).prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual('/appointments/'+expectedAppointment.id)
    })

    it('should navigate to lab view on history record click', async () => {
      const { wrapper } = await setup()
      const tr = wrapper.find('tr').at(2)

      act(() => {
        const onClick = tr.find('button').at(0).prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual('/labs/'+expectedLab.id)
    })
  })
})
