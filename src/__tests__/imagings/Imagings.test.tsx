import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Imagings from '../../imagings/Imagings'
import NewImagingRequest from '../../imagings/requests/NewImagingRequest'
import ImagingRepository from '../../shared/db/ImagingRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Imaging from '../../shared/model/Imaging'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Imagings', () => {
  jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([])
  jest
    .spyOn(ImagingRepository, 'find')
    .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Imaging)
  jest
    .spyOn(PatientRepository, 'find')
    .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)

  describe('routing', () => {
    describe('/imaging/new', () => {
      it('should render the new imaging request screen when /imaging/new is accessed', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.RequestImaging] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
          imaging: {
            imaging: { id: 'imagingId', patient: 'patient' } as Imaging,
            patient: { id: 'patientId', fullName: 'some name' },
            error: {},
          },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/imaging/new']}>
              <Imagings />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewImagingRequest)).toHaveLength(1)
      })

      it('should not navigate to /imagings/new if the user does not have RequestLab permissions', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/imagings/new']}>
              <Imagings />
            </MemoryRouter>
          </Provider>,
        )

        expect(wrapper.find(NewImagingRequest)).toHaveLength(0)
      })
    })
  })
})
