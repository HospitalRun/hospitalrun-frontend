import '../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { Toaster } from '@hospitalrun/components'
import Dashboard from 'dashboard/Dashboard'
import Appointments from 'scheduling/appointments/Appointments'
import NewAppointment from 'scheduling/appointments/new/NewAppointment'
import NewPatient from '../persons/patients/new/NewPatient'
import ViewPatient from '../persons/patients/view/ViewPatient'
import PersonRepository from '../clients/db/PersonRepository'
import Patient from '../model/Persons/Patient'
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

    describe('/patients/:id', () => {
      it('should render the view patient screen when /patients/:id is accessed', async () => {
        jest.spyOn(PersonRepository, 'find')
        const mockedPersonRepository = mocked(PersonRepository, true)
        const patient = {
          id: '123',
          prefix: 'test',
          givenName: 'test',
          familyName: 'test',
          suffix: 'test',
          friendlyId: 'P00001',
        } as Patient

        mockedPersonRepository.find.mockResolvedValue(patient)

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
            })}
          >
            <MemoryRouter initialEntries={['/appointments']}>
              <HospitalRun />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(Appointments)).toHaveLength(1)
      })

      it('should render the Dashboard when the user does not have read appointment privileges', () => {
        const wrapper = mount(
          <Provider
            store={mockStore({
              title: 'test',
              user: { permissions: [] },
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
