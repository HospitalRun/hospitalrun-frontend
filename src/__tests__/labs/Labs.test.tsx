import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../labs/Labs'
import NewLabRequest from '../../labs/requests/NewLabRequest'
import ViewLab from '../../labs/ViewLab'
import * as titleUtil from '../../page-header/title/TitleContext'
import LabRepository from '../../shared/db/LabRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Labs', () => {
  jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
  jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
  jest
    .spyOn(LabRepository, 'find')
    .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Lab)
  jest
    .spyOn(PatientRepository, 'find')
    .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)
  const setup = (route: string, permissions: Permissions[] = []) => {
    const store = mockStore({
      user: { permissions },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
      lab: {
        lab: ({
          id: '1234',
          patientId: 'patientId',
          requestedOn: new Date().toISOString(),
        } as unknown) as Lab,
        patient: { id: 'patientId', fullName: 'some name' },
        error: {},
      },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>
            <Labs />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  describe('routing', () => {
    describe('/labs/new', () => {
      it('should render the new lab request screen when /labs/new is accessed', () => {
        const permissions: Permissions[] = [Permissions.RequestLab]
        const { wrapper } = setup('/labs/new', permissions)

        expect(wrapper.find(NewLabRequest)).toHaveLength(1)
      })

      it('should not navigate to /labs/new if the user does not have RequestLab permissions', () => {
        const { wrapper } = setup('/labs/new')

        expect(wrapper.find(NewLabRequest)).toHaveLength(0)
      })
    })

    describe('/labs/:id', () => {
      it('should render the view lab screen when /labs/:id is accessed', async () => {
        const permissions: Permissions[] = [Permissions.ViewLab]
        const { wrapper } = setup('/labs/1234', permissions)

        expect(wrapper.find(ViewLab)).toHaveLength(1)
      })
    })

    it('should not navigate to /labs/:id if the user does not have ViewLab permissions', async () => {
      const { wrapper } = setup('/labs/1234')

      expect(wrapper.find(ViewLab)).toHaveLength(0)
    })
  })
})
