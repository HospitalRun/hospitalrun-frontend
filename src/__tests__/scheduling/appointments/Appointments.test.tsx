import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Appointments from 'scheduling/appointments/Appointments'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Calendar } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import * as titleUtil from '../../../page-header/useTitle'

describe('Appointments', () => {
  const expectedAppointments = [
    {
      id: '123',
      rev: '1',
      patientId: '1234',
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      location: 'location',
      reason: 'reason',
    },
  ]

  const setup = async () => {
    const mockStore = createMockStore([thunk])
    return mount(
      <Provider store={mockStore({ appointments: { appointments: expectedAppointments } })}>
        <MemoryRouter initialEntries={['/appointments']}>
          <Appointments />
        </MemoryRouter>
      </Provider>,
    )
  }

  it('should use "Appointments" as the header', () => {
    jest.spyOn(titleUtil, 'default')
    setup()
    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.label')
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
        title: expectedAppointments[0].patientId,
        allDay: false,
      },
    ]

    const calendar = wrapper.find(Calendar)
    expect(calendar).toHaveLength(1)
    expect(calendar.prop('events')).toEqual(expectedEvents)
  })
})
