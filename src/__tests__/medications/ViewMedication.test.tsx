import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewMedication from '../../medications/ViewMedication'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/TitleContext'
import MedicationRepository from '../../shared/db/MedicationRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Medication from '../../shared/model/Medication'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

let expectedDate: any

describe('View Medication', () => {
  const mockPatient = { fullName: 'test' }
  const mockMedication = {
    id: '12456',
    status: 'draft',
    patient: '1234',
    medication: 'medication',
    intent: 'order',
    priority: 'routine',
    quantity: { value: 1, unit: 'unit' },
    notes: 'medication notes',
    requestedOn: '2020-03-30T04:43:20.102Z',
  } as Medication

  expectedDate = new Date()
  const setup = (medication: Medication, permissions: Permissions[], error = {}) => {
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedDate.valueOf())
    const setButtonToolBarSpy = jest.fn()
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(MedicationRepository, 'find').mockResolvedValue(medication)
    jest.spyOn(MedicationRepository, 'saveOrUpdate').mockResolvedValue(mockMedication)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient as Patient)
    const history = createMemoryHistory()
    history.push(`medications/${medication.id}`)
    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
      medication: {
        medication: { ...mockMedication, ...medication },
        patient: mockPatient,
        error,
        status: Object.keys(error).length > 0 ? 'error' : 'completed',
      },
    } as any)

    return render(
      <ButtonBarProvider.ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/medications/:id">
              <titleUtil.TitleProvider>
                <ViewMedication />
              </titleUtil.TitleProvider>
            </Route>
          </Router>
        </Provider>
      </ButtonBarProvider.ButtonBarProvider>,
    )
  }

  describe('page content', () => {
    it('should display the patients full name', async () => {
      setup({} as Medication, [Permissions.ViewMedication])

      await waitFor(() => {
        expect(screen.getByText(/medications.medication.for/i)).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.getByText(mockPatient.fullName)).toBeInTheDocument()
      })
    })
  })
  it('should display the medication ', async () => {
    const expectedMedication = { ...mockMedication } as Medication

    setup({} as Medication, [Permissions.ViewMedication])
    await waitFor(() => {
      expect(screen.getByText(/medications.medication.medication/i)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(expectedMedication.medication)).toBeInTheDocument()
    })
  })

  it('should display the requested on date', async () => {
    const expectedMedication = { ...mockMedication } as Medication

    setup({} as Medication, [Permissions.ViewMedication])

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /medications.medication.requestedOn/i }),
      ).toBeInTheDocument()

      expect(
        screen.getByText(format(new Date(expectedMedication.requestedOn), 'yyyy-MM-dd hh:mm a')),
      ).toBeInTheDocument()
    })
  })

  it('should not display the canceled date if the medication is not canceled', async () => {
    setup({} as Medication, [Permissions.ViewMedication])

    expect(
      screen.queryByRole('heading', { name: /medications\.medication\.canceledOn/i }),
    ).not.toBeInTheDocument()
  })

  it('should display the notes in the notes text field', async () => {
    const expectedMedication = { ...mockMedication } as Medication

    setup(expectedMedication, [Permissions.ViewMedication])

    await waitFor(() => {
      expect(screen.getByText(/medications\.medication\.notes/i)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /notes/ })).toHaveValue(expectedMedication.notes)
    })
  })

  describe('draft medication request', () => {
    it('should display a warning badge if the status is draft', async () => {
      const expectedMedication = { ...mockMedication, status: 'draft' } as Medication
      setup(expectedMedication, [Permissions.ViewMedication])

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /medications\.medication\.status/i,
          }),
        ).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: expectedMedication.status })).toBeVisible()
      })
    })

    it('should display a update medication and cancel medication button if the medication is in a draft state', async () => {
      const expectedMedication = { ...mockMedication, status: 'draft' } as Medication
      setup(expectedMedication, [
        Permissions.ViewMedication,
        Permissions.CompleteMedication,
        Permissions.CancelMedication,
      ])

      expect(screen.getByRole('button', { name: /medications\.requests\.update/i })).toBeVisible()

      expect(screen.getByRole('button', { name: /medications\.requests\.cancel/ })).toBeVisible()
    })
  })

  describe('canceled medication request', () => {
    it('should display a danger badge if the status is canceled', async () => {
      const expectedMedication = { ...mockMedication, status: 'canceled' } as Medication
      setup(expectedMedication as Medication, [Permissions.ViewMedication])

      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /medications\.medication\.status/i,
          }),
        ).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: expectedMedication.status })).toBeInTheDocument()
      })
    })

    it('should display the canceled on date if the medication request has been canceled', async () => {
      const expectedMedication = {
        ...mockMedication,
        status: 'canceled',
        canceledOn: '2020-03-30T04:45:20.102Z',
      } as Medication
      setup(expectedMedication, [Permissions.ViewMedication])
      const date = format(new Date(expectedMedication.canceledOn as string), 'yyyy-MM-dd hh:mm a')
      await waitFor(() => {
        expect(screen.getByText(/medications.medication.canceledOn/)).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.getByText(date)).toBeInTheDocument()
      })
    })

    it('should not display cancel button if the medication is canceled', async () => {
      setup({ ...mockMedication, status: 'canceled' } as Medication, [
        Permissions.ViewMedication,
        Permissions.CancelMedication,
      ])
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: /medications\.requests\.cancel/ }),
        ).not.toBeInTheDocument()
      })
    })
    it('should not display an update button if the medication is canceled', async () => {
      setup({ ...mockMedication, status: 'canceled' } as Medication, [Permissions.ViewMedication])

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /actions\.update/ })).not.toBeInTheDocument()
      })
    })
  })
  describe('on update', () => {
    it('should update the medication with the new information', async () => {
      const expectedNotes = 'new notes'
      const expectedMedication = { ...mockMedication, notes: '' } as Medication
      setup(expectedMedication, [Permissions.ViewMedication])

      userEvent.type(screen.getByRole('textbox', { name: /notes/ }), expectedNotes)

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /notes/ })).toHaveValue(`${expectedNotes}`)
      })

      userEvent.click(screen.getByRole('button', { name: /medications\.requests\.update/ }))

      await waitFor(() => {
        expect(MedicationRepository.saveOrUpdate).toHaveBeenCalled()
        expect(MedicationRepository.saveOrUpdate).toHaveBeenCalledWith({
          ...expectedMedication,
          notes: expectedNotes,
        })
      })
    })
  })

  describe('on cancel', () => {
    it('should mark the status as canceled and fill in the cancelled on date with the current time', async () => {
      const expectedMedication = { ...mockMedication } as Medication
      setup(expectedMedication, [
        Permissions.ViewMedication,
        Permissions.CompleteMedication,
        Permissions.CancelMedication,
      ])

      const cancelButton = screen.getByRole('button', { name: /medications\.requests\.cancel/ })

      userEvent.click(cancelButton)

      expect(MedicationRepository.saveOrUpdate).toHaveBeenCalled()
      expect(MedicationRepository.saveOrUpdate).toHaveBeenCalledWith({
        ...expectedMedication,
        status: 'canceled',
        canceledOn: expectedDate.toISOString(),
      })
    })
  })
})
