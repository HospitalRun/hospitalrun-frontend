import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Medications from '../../medications/Medications'
import { TitleProvider } from '../../page-header/title/TitleContext'
import MedicationRepository from '../../shared/db/MedicationRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Medication from '../../shared/model/Medication'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Medications', () => {
  const setup = (route: string, permissions: Permissions[] = []) => {
    jest.resetAllMocks()
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue([])
    jest
      .spyOn(MedicationRepository, 'find')
      .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Medication)
    jest
      .spyOn(PatientRepository, 'find')
      .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)

    const store = mockStore({
      title: 'test',
      user: { permissions },
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

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <TitleProvider>
            <Medications />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
  }

  describe('routing', () => {
    describe('/medications/new', () => {
      it('should render the new medication request screen when /medications/new is accessed', () => {
        const { container } = setup('/medications/new', [Permissions.RequestMedication])

        expect(container.querySelector('form')).toBeInTheDocument()
      })

      it('should not navigate to /medications/new if the user does not have RequestMedication permissions', () => {
        const { container } = setup('/medications/new')

        expect(container.querySelector('form')).not.toBeInTheDocument()
      })
    })

    describe('/medications/:id', () => {
      it('should render the view medication screen when /medications/:id is accessed', async () => {
        const { container } = setup('/medications/1234', [Permissions.ViewMedication])

        expect(container).toHaveTextContent(/medications.medication.status/i)
      })

      it('should not navigate to /medications/:id if the user does not have ViewMedication permissions', async () => {
        const { container } = setup('/medications/1234')

        expect(container).not.toHaveTextContent(/medications.medication.status/i)
      })
    })
  })
})
