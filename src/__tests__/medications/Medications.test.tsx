import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Medications from '../../medications/Medications'
import NewMedicationRequest from '../../medications/requests/NewMedicationRequest'
import ViewMedication from '../../medications/ViewMedication'
import MedicationRepository from '../../shared/db/MedicationRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Medication from '../../shared/model/Medication'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Medications', () => {
  jest.spyOn(MedicationRepository, 'findAll').mockResolvedValue([])
  jest
    .spyOn(MedicationRepository, 'find')
    .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Medication)
  jest
    .spyOn(PatientRepository, 'find')
    .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)

  describe('routing', () => {
    describe('/medications/new', () => {
      it('should render the new medication request screen when /medications/new is accessed', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.RequestMedication] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          medication: {
            medication: ({ id: 'medicationId', patientId: 'patientId' } as unknown) as Medication,
            patient: { id: 'patientId', fullName: 'some name' },
            error: {},
          },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/medications/new']}>
              <Medications />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewMedicationRequest)).toHaveLength(1)
      })

      it('should not navigate to /medications/new if the user does not have RequestMedication permissions', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/medications/new']}>
              <Medications />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewMedicationRequest)).toHaveLength(0)
      })
    })

    describe('/medications/:id', () => {
      it('should render the view medication screen when /medications/:id is accessed', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.ViewMedication] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          medication: {
            medication: ({
              id: 'medicationId',
              patientId: 'patientId',
              requestedOn: new Date().toISOString(),
              medication: 'medication',
              status: 'draft',
              intent: 'order',
              priority: 'routine',
              quantity: { value: 1, unit: 'unit' },
              notes: 'medication notes',
            } as unknown) as Medication,
            patient: { id: 'patientId', fullName: 'some name' },
            error: {},
          },
        } as any)

        let wrapper: any

        await act(async () => {
          wrapper = await mount(
            <Provider store={store}>
              <MemoryRouter initialEntries={['/medications/1234']}>
                <Medications />
              </MemoryRouter>
            </Provider>,
          )

          expect(wrapper.find(ViewMedication)).toHaveLength(1)
        })
      })

      it('should not navigate to /medications/:id if the user does not have ViewMedication permissions', async () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = await mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/medications/1234']}>
              <Medications />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(ViewMedication)).toHaveLength(0)
      })
    })
  })
})
