import '../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { Toaster } from '@hospitalrun/components'

import { act } from 'react-dom/test-utils'
import Dashboard from 'dashboard/Dashboard'
import Appointments from 'scheduling/appointments/Appointments'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import EditAppointment from 'scheduling/appointments/edit/EditAppointment'
import { addBreadcrumbs } from 'breadcrumbs/breadcrumbs-slice'
import NewPatient from '../patients/new/NewPatient'
import EditPatient from '../patients/edit/EditPatient'
import ViewPatient from '../patients/view/ViewPatient'
import PatientRepository from '../clients/db/PatientRepository'
import AppointmentRepository from '../clients/db/AppointmentRepository'
import Patient from '../model/Patient'
import Appointment from '../model/Appointment'
import HospitalRun from '../HospitalRun'
import Permissions from '../model/Permissions'

const mockStore = configureMockStore([thunk])

describe('HospitalRun', () => {
  describe('routing', () => {
    describe('/patients/new', () => {
      it('should render the new patient screen when /patients/new is accessed', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.WritePatients] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/patients/new']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewPatient)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'patients.label', location: '/patients' },
            { i18nKey: 'patients.newPatient', location: '/patients/new' },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard if the user does not have write patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/patients/new']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/patients/edit/:id', () => {
      it('should render the edit patient screen when /patients/edit/:id is accessed', () => {
        jest.spyOn(PatientRepository, 'find')
        const mockedPatientRepository = mocked(PatientRepository, true)
        const patient = {
          id: '123',
          prefix: 'test',
          givenName: 'test',
          familyName: 'test',
          suffix: 'test',
          code: 'P00001',
        } as Patient

        mockedPatientRepository.find.mockResolvedValue(patient)

        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.WritePatients, Permissions.ReadPatients] },
          patient: { patient },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/patients/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(EditPatient)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'patients.label', location: '/patients' },
            { text: 'test test test', location: `/patients/${patient.id}` },
            { i18nKey: 'patients.editPatient', location: `/patients/${patient.id}/edit` },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WritePatients] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/patients/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have write patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.ReadPatients] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/patients/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/patients/:id', () => {
      it('should render the view patient screen when /patients/:id is accessed', async () => {
        jest.spyOn(PatientRepository, 'find')
        const mockedPatientRepository = mocked(PatientRepository, true)
        const patient = {
          id: '123',
          prefix: 'test',
          givenName: 'test',
          familyName: 'test',
          suffix: 'test',
          code: 'P00001',
        } as Patient

        mockedPatientRepository.find.mockResolvedValue(patient)

        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ReadPatients] },
          patient: { patient },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/patients/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewPatient)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'patients.label', location: '/patients' },
            { text: 'test test test', location: `/patients/${patient.id}` },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/patients/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/appointments', () => {
      it('should render the appointments screen when /appointments is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ReadAppointments] },
          appointments: { appointments: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/appointments']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        await act(async () => {
          wrapper.update()
        })

        expect(wrapper.find(Appointments)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/appointments']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/appointments/new', () => {
      it('should render the new appointment screen when /appointments/new is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.WriteAppointments] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/appointments/new']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        wrapper.update()

        expect(wrapper.find(NewAppointment)).toHaveLength(1)
        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
            { i18nKey: 'scheduling.appointments.newAppointment', location: '/appointments/new' },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/appointments/new']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })

    describe('/appointments/edit/:id', () => {
      it('should render the edit appointment screen when /appointments/edit/:id is accessed', () => {
        jest.spyOn(AppointmentRepository, 'find')
        const mockedAppointmentRepository = mocked(AppointmentRepository, true)
        const mockedPatientRepository = mocked(PatientRepository, true)
        const appointment = {
          id: '123',
          patientId: '456',
        } as Appointment

        const patient = {
          id: '456',
        } as Patient

        mockedAppointmentRepository.find.mockResolvedValue(appointment)
        mockedPatientRepository.find.mockResolvedValue(patient)

        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.WriteAppointments, Permissions.ReadAppointments] },
          appointment: { appointment, patient: {} as Patient },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/appointments/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(EditAppointment)).toHaveLength(1)

        expect(store.getActions()).toContainEqual(
          addBreadcrumbs([
            { i18nKey: 'scheduling.appointments.label', location: '/appointments' },
            { text: '123', location: '/appointments/123' },
            {
              i18nKey: 'scheduling.appointments.editAppointment',
              location: '/appointments/edit/123',
            },
            { i18nKey: 'dashboard.label', location: '/' },
          ]),
        )
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WriteAppointments] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/appointments/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have write appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.ReadAppointments] },
              breadcrumbs: { breadcrumbs: [] },
              components: { sidebarCollapsed: false },
            })}
          >
            <MemoryRouter initialEntries={['/appointments/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Dashboard)).toHaveLength(1)
      })
    })
  })

  describe('layout', () => {
    it('should render a Toaster', () => {
      const wrapper = mount(
        <Provider
          store={mockStore({
            title: 'test',
            user: { permissions: [Permissions.WritePatients] },
            breadcrumbs: { breadcrumbs: [] },
            components: { sidebarCollapsed: false },
          })}
        >
          <MemoryRouter initialEntries={['/']}>
            <HospitalRun />
          </MemoryRouter>
        </Provider>,
      )

      expect(wrapper.find(Toaster)).toHaveLength(1)
    })
  })
})
