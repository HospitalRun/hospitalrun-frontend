import '../../../__mocks__/matchMediaMock'

import { Calendar } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import AppointmentRepository from '../../../clients/db/AppointmentRepository'
import PatientRepository from '../../../clients/db/PatientRepository'
import Appointment from '../../../model/Appointment'
import Patient from '../../../model/Patient'
import * as ButtonBarProvider from '../../../page-header/ButtonBarProvider'
import * as titleUtil from '../../../page-header/useTitle'
import ViewAppointments from '../../../scheduling/appointments/ViewAppointments'
import { RootState } from '../../../store'

describe('ViewAppointments', () => {
  const expectedAppointments = [
    {
      id: '123',
      rev: '1',
      patient: '1234',
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      location: 'location',
      reason: 'reason',
    },
  ] as Appointment[]

  const setup = async () => {
    jest.spyOn(AppointmentRepository, 'findAll').mockResolvedValue(expectedAppointments)
    jest.spyOn(PatientRepository, 'find')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue({
      id: '123',
      fullName: 'patient full name',
    } as Patient)
    const mockStore = createMockStore<RootState, any>([thunk])
    return mount(
      <Provider store={mockStore({ appointments: { appointments: expectedAppointments } } as any)}>
        <MemoryRouter initialEntries={['/appointments']}>
          <ViewAppointments />
        </MemoryRouter>
      </Provider>,
    )
  }

  it('should use "Appointments" as the header', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })
    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.label')
  })

  it('should add a "New Appointment" button to the button tool bar', async () => {
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
    const setButtonToolBarSpy = jest.fn()
    mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

    await act(async () => {
      await setup()
    })

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect((actualButtons[0] as any).props.children).toEqual('scheduling.appointments.new')
  })

  it('should render a calendar with the proper events', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })
    wrapper.update()

    const expectedEvents = [
      {
        id: expectedAppointments[0].id,
        start: new Date(expectedAppointments[0].startDateTime),
        end: new Date(expectedAppointments[0].endDateTime),
        title: 'patient full name',
        allDay: false,
      },
    ]

    const calendar = wrapper.find(Calendar)
    expect(calendar).toHaveLength(1)
    expect(calendar.prop('events')).toEqual(expectedEvents)
  })
})
