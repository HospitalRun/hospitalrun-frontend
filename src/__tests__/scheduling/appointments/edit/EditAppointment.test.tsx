import { Button } from '@hospitalrun/components'
import { roundToNearestMinutes, addMinutes } from 'date-fns'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import * as titleUtil from '../../../../page-header/title/useTitle'
import AppointmentDetailForm from '../../../../scheduling/appointments/AppointmentDetailForm'
import EditAppointment from '../../../../scheduling/appointments/edit/EditAppointment'
import AppointmentRepository from '../../../../shared/db/AppointmentRepository'
import PatientRepository from '../../../../shared/db/PatientRepository'
import Appointment from '../../../../shared/model/Appointment'
import Patient from '../../../../shared/model/Patient'
import { RootState } from '../../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Edit Appointment', () => {
  const appointment = {
    id: '123',
    patient: '456',
    startDateTime: roundToNearestMinutes(new Date(), { nearestTo: 15 }).toISOString(),
    endDateTime: addMinutes(roundToNearestMinutes(new Date(), { nearestTo: 15 }), 60).toISOString(),
    location: 'location',
    reason: 'reason',
    type: 'type',
  } as Appointment

  const patient = {
    id: '456',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    fullName: 'givenName familyName suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    code: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as Patient

  let history: any
  let store: MockStore

  const setup = () => {
    jest.spyOn(AppointmentRepository, 'saveOrUpdate')
    jest.spyOn(AppointmentRepository, 'find')
    jest.spyOn(PatientRepository, 'find')

    const mockedAppointmentRepository = mocked(AppointmentRepository, true)
    mockedAppointmentRepository.find.mockResolvedValue(appointment)
    mockedAppointmentRepository.saveOrUpdate.mockResolvedValue(appointment)

    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ appointment: { appointment, patient } } as any)

    history.push('/appointments/edit/123')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/appointments/edit/:id">
            <EditAppointment />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should render an edit appointment form', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    expect(wrapper.find(AppointmentDetailForm)).toHaveLength(1)
  })

  it('should load an appointment when component loads', async () => {
    await act(async () => {
      await setup()
    })

    expect(AppointmentRepository.find).toHaveBeenCalledWith(appointment.id)
    expect(PatientRepository.find).toHaveBeenCalledWith(appointment.patient)
  })

  it('should use the correct title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })
    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.editAppointment')
  })

  it('should updateAppointment when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(AppointmentRepository.saveOrUpdate).toHaveBeenCalledWith(appointment)
  })

  it('should navigate to /appointments/:id when save is successful', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any

    await act(async () => {
      await onClick()
    })

    expect(history.location.pathname).toEqual('/appointments/123')
  })

  it('should navigate to /appointments/:id when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const cancelButton = wrapper.find(Button).at(1)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    wrapper.update()
    expect(history.location.pathname).toEqual('/appointments/123')
  })
})
