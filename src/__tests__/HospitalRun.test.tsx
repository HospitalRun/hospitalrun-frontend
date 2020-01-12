import '../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { Toaster } from '@hospitalrun/components'
import NewPatient from '../patients/new/NewPatient'
import ViewPatient from '../patients/view/ViewPatient'
import PatientRepository from '../clients/db/PatientRepository'
import Patient from '../model/Patient'
import HospitalRun from '../HospitalRun'
import Permissions from '../model/Permissions'

const mockStore = configureMockStore([thunk])

describe('HospitalRun', () => {
  describe('routing', () => {
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
