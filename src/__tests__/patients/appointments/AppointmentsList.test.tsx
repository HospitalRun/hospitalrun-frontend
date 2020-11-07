import * as components from '@hospitalrun/components'
import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AppointmentsList from '../../../patients/appointments/AppointmentsList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const expectedPatient = {
  id: '123',
} as Patient

const expectedAppointments = [
  {
    id: '456',
    rev: '1',
    patient: '1234',
    startDateTime: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
    endDateTime: new Date(2020, 1, 1, 9, 30, 0, 0).toISOString(),
    location: 'location',
    reason: 'Follow Up',
  },
  {
    id: '123',
    rev: '1',
    patient: '1234',
    startDateTime: new Date(2020, 1, 1, 8, 0, 0, 0).toISOString(),
    endDateTime: new Date(2020, 1, 1, 8, 30, 0, 0).toISOString(),
    location: 'location',
    reason: 'Checkup',
  },
] as Appointment[]

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()

let store: any

const setup = async (patient = expectedPatient, appointments = expectedAppointments) => {
  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue(appointments)
  store = mockStore({ patient, appointments: { appointments } } as any)

  let wrapper: any

  await act(async () => {
    wrapper = await mount(
      <Router history={history}>
        <Provider store={store}>
          <AppointmentsList patient={patient} />
        </Provider>
      </Router>,
    )
  })

  wrapper.update()

  return { wrapper: wrapper as ReactWrapper }
}

describe('AppointmentsList', () => {
  describe('Table', () => {
    it('should render a list of appointments', async () => {
      const { wrapper } = await setup()

      const table = wrapper.find(Table)

      const columns = table.prop('columns')
      const actions = table.prop('actions') as any

      expect(table).toHaveLength(1)

      expect(columns[0]).toEqual(
        expect.objectContaining({
          label: 'scheduling.appointment.startDate',
          key: 'startDateTime',
        }),
      )
      expect(columns[1]).toEqual(
        expect.objectContaining({ label: 'scheduling.appointment.endDate', key: 'endDateTime' }),
      )
      expect(columns[2]).toEqual(
        expect.objectContaining({ label: 'scheduling.appointment.location', key: 'location' }),
      )
      expect(columns[3]).toEqual(
        expect.objectContaining({ label: 'scheduling.appointment.type', key: 'type' }),
      )

      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
    })

    it('should navigate to appointment profile on appointment click', async () => {
      const { wrapper } = await setup()
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').at(0).prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual('/appointments/456')
    })
  })

  describe('Empty list', () => {
    it('should render a warning message if there are no appointments', async () => {
      const { wrapper } = await setup(expectedPatient, [])
      const alert = wrapper.find(components.Alert)

      expect(alert).toHaveLength(1)
      expect(alert.prop('title')).toEqual('patient.appointments.warning.noAppointments')
      expect(alert.prop('message')).toEqual('patient.appointments.addAppointmentAbove')
    })
  })

  describe('New appointment button', () => {
    it('should render a new appointment button if there is an appointment', async () => {
      const { wrapper } = await setup()

      const addNewAppointmentButton = wrapper.find(components.Button).at(0)
      expect(addNewAppointmentButton).toHaveLength(1)
      expect(addNewAppointmentButton.text().trim()).toEqual('scheduling.appointments.new')
    })

    it('should render a new appointment button if there are no appointments', async () => {
      const { wrapper } = await setup(expectedPatient, [])

      const addNewAppointmentButton = wrapper.find(components.Button).at(0)
      expect(addNewAppointmentButton).toHaveLength(1)
      expect(addNewAppointmentButton.text().trim()).toEqual('scheduling.appointments.new')
    })

    it('should navigate to new appointment page', async () => {
      const { wrapper } = await setup()

      await act(async () => {
        await wrapper.find(components.Button).at(0).simulate('click')
      })
      wrapper.update()

      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })
})
