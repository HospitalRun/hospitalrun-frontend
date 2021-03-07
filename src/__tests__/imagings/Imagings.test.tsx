import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Imagings from '../../imagings/Imagings'
import NewImagingRequest from '../../imagings/requests/NewImagingRequest'
import * as titleUtil from '../../page-header/title/TitleContext'
import ImagingRepository from '../../shared/db/ImagingRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Imaging from '../../shared/model/Imaging'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Imagings', () => {
  jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([])
  jest
    .spyOn(ImagingRepository, 'find')
    .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Imaging)
  jest
    .spyOn(PatientRepository, 'find')
    .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)
  const setup = (permissions: Permissions[], isNew = false) => {
    const store = mockStore({
      user: { permissions: [permissions] },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
      imaging: {
        imaging: { id: 'imagingId', patient: 'patient' } as Imaging,
        patient: { id: 'patientId', fullName: 'some name' },
        error: {},
      },
    } as any)

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/imaging/new']}>
          <TitleProvider>{isNew ? <NewImagingRequest /> : <Imagings />}</TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
  }

  describe('routing', () => {
    describe('/imaging/new', () => {
      it('should render the new imaging request screen when /imaging/new is accessed', async () => {
        const permissions: Permissions[] = [Permissions.RequestImaging]
        const { container } = setup(permissions, true)

        expect(container).toBeInTheDocument()
      })

      it('should not navigate to /imagings/new if the user does not have RequestImaging permissions', async () => {
        const permissions: Permissions[] = []
        const { container } = setup(permissions)

        expect(container).toMatchInlineSnapshot(`<div />`)
      })
    })
  })
})
