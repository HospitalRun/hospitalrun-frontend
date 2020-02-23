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
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WritePatients] },
            })}
          >
            <MemoryRouter initialEntries={['/patients/new']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewPatient)).toHaveLength(1)
      })

      it('should render the Dashboard if the user does not have write patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
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
          friendlyId: 'P00001',
        } as Patient

        mockedPatientRepository.find.mockResolvedValue(patient)

        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WritePatients, Permissions.ReadPatients] },
              patient: { patient: {} as Patient },
            })}
          >
            <MemoryRouter initialEntries={['/patients/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(EditPatient)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have read patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WritePatients] },
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
          friendlyId: 'P00001',
        } as Patient

        mockedPatientRepository.find.mockResolvedValue(patient)

        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.ReadPatients] },
              patient,
            })}
          >
            <MemoryRouter initialEntries={['/patients/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewPatient)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have read patient privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
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
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.ReadAppointments] },
              appointments: { appointments: [] },
            })}
          >
            <MemoryRouter initialEntries={['/appointments']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        await act(async () => {
          wrapper.update()
        })

        expect(wrapper.find(Appointments)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
              appointments: { appointments: [] },
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
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WriteAppointments] },
            })}
          >
            <MemoryRouter initialEntries={['/appointments/new']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewAppointment)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
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

        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WriteAppointments, Permissions.ReadAppointments] },
              appointment: { appointment: {} as Appointment, patient: {} as Patient },
            })}
          >
            <MemoryRouter initialEntries={['/appointments/edit/123']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(EditAppointment)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [Permissions.WriteAppointments] },
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
