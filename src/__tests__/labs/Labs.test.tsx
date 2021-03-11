import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../labs/Labs'
import * as titleUtil from '../../page-header/title/TitleContext'
import LabRepository from '../../shared/db/LabRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider, useTitle } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

const Title = () => {
  const { title } = useTitle()

  return <h1>{title}</h1>
}

const expectedLab = {
  code: 'L-code',
  id: '1234',
  patient: '1234',
  type: 'Type',
  requestedOn: new Date().toISOString(),
} as Lab
const expectedPatient = {
  fullName: 'fullName',
  id: '1234',
} as Patient

const setup = (initialPath: string, permissions: Permissions[]) => {
  jest.resetAllMocks()
  jest.spyOn(LabRepository, 'find').mockResolvedValue(expectedLab)
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  const store = mockStore({ user: { permissions } } as any)

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialPath]}>
          <TitleProvider>
            <Title />
            <Labs />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    ),
  }
}

describe('Labs', () => {
  describe('routing', () => {
    describe('/labs', () => {
      it('should render the view labs screen when /labs is accessed', async () => {
        setup('/labs', [Permissions.ViewLabs])
        expect(screen.getByRole('heading', { name: /labs\.label/i })).toBeInTheDocument()
      })

      it('should not navigate to /labs if the user does not have ViewLabs permissions', async () => {
        setup('/labs', [])
        expect(screen.queryByRole('heading', { name: /labs\.label/i })).not.toBeInTheDocument()
      })
    })

    describe('/labs/new', () => {
      it('should render the new lab request screen when /labs/new is accessed', async () => {
        setup('/labs/new', [Permissions.RequestLab])
        expect(screen.getByRole('heading', { name: /labs\.requests\.new/i })).toBeInTheDocument()
      })

      it('should not navigate to /labs/new if the user does not have RequestLab permissions', async () => {
        setup('/labs/new', [])
        expect(
          screen.queryByRole('heading', { name: /labs\.requests\.new/i }),
        ).not.toBeInTheDocument()
      })
    })

    describe('/labs/:id', () => {
      it('should render the view lab screen when /labs/:id is accessed', async () => {
        setup('/labs/1234', [Permissions.ViewLab])
        expect(
          await screen.findByRole('heading', {
            name: `${expectedLab.type} for ${expectedPatient.fullName}(${expectedLab.code})`,
          }),
        ).toBeInTheDocument()
      })

      it('should not navigate to /labs/:id if the user does not have ViewLab permissions', async () => {
        setup('/labs/1234', [])
        expect(
          screen.queryByRole('heading', {
            name: `${expectedLab.type} for ${expectedPatient.fullName}(${expectedLab.code})`,
          }),
        ).not.toBeInTheDocument()
      })
    })
  })
})
