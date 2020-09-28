import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Dashboard from '../../../dashboard/Dashboard'
import HospitalRun from '../../../HospitalRun'
import { addBreadcrumbs } from '../../../page-header/breadcrumbs/breadcrumbs-slice'
import * as titleUtil from '../../../page-header/title/TitleContext'
import Appointments from '../../../scheduling/appointments/Appointments'
import EditAppointment from '../../../scheduling/appointments/edit/EditAppointment'
import NewAppointment from '../../../scheduling/appointments/new/NewAppointment'
import ViewAppointments from '../../../scheduling/appointments/ViewAppointments'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../../shared/model/Appointment'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])
let route: any

describe('/appointments', () => {
  // eslint-disable-next-line no-shadow
  const setup = (route: string, permissions: Permissions[], renderHr: boolean = false) => {
    const appointment = {
      id: '123',
      patient: '456',
    } as Appointment

    const patient = {
      id: '456',
    } as Patient

    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(appointment)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const store = mockStore({
      title: 'test',
      user: { user: { id: '123' }, permissions },
      appointment: { appointment, patient: { id: '456' } as Patient },
      appointments: [{ appointment, patient: { id: '456' } as Patient }],
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>{renderHr ? <HospitalRun /> : <Appointments />}</TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
    if (!renderHr) {
      wrapper.find(Appointments).props().updateTitle = jest.fn()
    }
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, store }
  }

  it('should render the appointments screen when /appointments is accessed', async () => {
    route = '/appointments'
    const permissions: Permissions[] = [Permissions.ReadAppointments]
    const { wrapper, store } = setup(route, permissions)

    expect(wrapper.find(ViewAppointments)).toHaveLength(1)

    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read appointment privileges', async () => {
    route = '/appointments'
    const permissions: Permissions[] = []
    const { wrapper } = setup(route, permissions, true)

    await act(async () => {
      wrapper.update()
    })
    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })
})

describe('/appointments/new', () => {
  // eslint-disable-next-line no-shadow
  const setup = (route: string, permissions: Permissions[], renderHr: boolean = false) => {
    const appointment = {
      id: '123',
      patient: '456',
    } as Appointment

    const patient = {
      id: '456',
    } as Patient

    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(appointment)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const store = mockStore({
      title: 'test',
      user: { user: { id: '123' }, permissions },
      appointment: { appointment, patient: { id: '456' } as Patient },
      appointments: [{ appointment, patient: { id: '456' } as Patient }],
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>{renderHr ? <HospitalRun /> : <NewAppointment />}</TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
    if (!renderHr) {
      wrapper.find(NewAppointment).props().updateTitle = jest.fn()
    }
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, store }
  }
  it('should render the new appointment screen when /appointments/new is accessed', async () => {
    route = '/appointments/new'
    const permissions: Permissions[] = [Permissions.WriteAppointments]
    const { wrapper, store } = setup(route, permissions, false)

    await act(async () => {
      await wrapper.update()
    })

    expect(wrapper.find(NewAppointment)).toHaveLength(1)
    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
        { i18nKey: 'scheduling.appointments.new', location: '/appointments/new' },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read appointment privileges', () => {
    route = '/appointments/new'
    const permissions: Permissions[] = []
    const { wrapper } = setup(route, permissions, true)

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })
})

describe('/appointments/edit/:id', () => {
  // eslint-disable-next-line no-shadow
  const setup = (route: string, permissions: Permissions[], renderHr: boolean = false) => {
    const appointment = {
      id: '123',
      patient: '456',
    } as Appointment

    const patient = {
      id: '456',
    } as Patient

    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(appointment)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const store = mockStore({
      title: 'test',
      user: { user: { id: '123' }, permissions },
      appointment: { appointment, patient: { id: '456' } as Patient },
      appointments: [{ appointment, patient: { id: '456' } as Patient }],
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>{renderHr ? <HospitalRun /> : <EditAppointment />}</TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
    if (!renderHr) {
      wrapper.find(EditAppointment).props().updateTitle = jest.fn()
    }
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, store }
  }

  it('should render the edit appointment screen when /appointments/edit/:id is accessed', () => {
    route = '/appointments/edit/123'
    const permissions: Permissions[] = [Permissions.WriteAppointments, Permissions.ReadAppointments]
    const { wrapper, store } = setup(route, permissions, false)

    expect(wrapper.find(EditAppointment)).toHaveLength(1)
    expect(AppointmentRepository.find).toHaveBeenCalledWith(appointment.id)

    // TODO: Not sure why calling AppointmentRepo.find(id) does not seem to get appointment.
    // Possibly something to do with store and state ?
    // expect(store.getActions()).toContainEqual({
    //   ...addBreadcrumbs([
    //     { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
    //     { text: '123', location: '/appointments/123' },
    //     {
    //       i18nKey: 'scheduling.appointments.editAppointment',
    //       location: '/appointments/edit/123',
    //     },
    //     { i18nKey: 'dashboard.label', location: '/' },
    //   ]),
    // })
  })

  it('should render the Dashboard when the user does not have read appointment privileges', () => {
    route = '/appointments/edit/123'
    const permissions: Permissions[] = []
    const { wrapper } = setup(route, permissions, true)

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })

  it('should render the Dashboard when the user does not have write appointment privileges', () => {
    route = '/appointments/edit/123'
    const permissions: Permissions[] = []
    const { wrapper } = setup(route, permissions, true)

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })
})
