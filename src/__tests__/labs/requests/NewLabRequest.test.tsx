import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewLabRequest from '../../../labs/requests/NewLabRequest'
import * as validationUtil from '../../../labs/utils/validate-lab'
import { LabError } from '../../../labs/utils/validate-lab'
import * as titleUtil from '../../../page-header/title/TitleContext'
import LabRepository from '../../../shared/db/LabRepository'
import PatientRepository from '../../../shared/db/PatientRepository'
import Lab from '../../../shared/model/Lab'
import Patient from '../../../shared/model/Patient'
import Visit from '../../../shared/model/Visit'
import { RootState } from '../../../shared/store'
import { expectOneConsoleError } from '../../test-utils/console.utils'

const mockStore = createMockStore<RootState, any>([thunk])
describe('New Lab Request', () => {
  let history: any
  const setup = (
    store = mockStore({
      title: '',
      user: { user: { id: 'userId' } },
    } as any),
  ) => {
    history = createMemoryHistory()
    history.push(`/labs/new`)
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())

    return render(
      <Provider store={store}>
        <Router history={history}>
          <titleUtil.TitleProvider>
            <NewLabRequest />
          </titleUtil.TitleProvider>
        </Router>
      </Provider>,
    )
  }

  describe('form layout', () => {
    const expectedDate = new Date()
    const expectedNotes = 'expected notes'
    const expectedLab = {
      patient: '1234567',
      type: 'expected type',
      status: 'requested',
      notes: [expectedNotes],
      id: '1234',
      requestedOn: expectedDate.toISOString(),
    } as Lab

    const visits = [
      {
        startDateTime: new Date().toISOString(),
        id: 'visit_id',
        type: 'visit_type',
      },
    ] as Visit[]
    const expectedPatient = { id: expectedLab.patient, fullName: 'Jim Bob', visits } as Patient

    beforeAll(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'search').mockResolvedValue([expectedPatient])
    })
    it('should have called the useUpdateTitle hook', async () => {
      setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalledTimes(1)
    })

    it('should render a patient typeahead', async () => {
      setup()
      const typeaheadInput = screen.getByPlaceholderText(/labs.lab.patient/i)

      expect(screen.getByText(/labs\.lab\.patient/i)).toBeInTheDocument()
      userEvent.type(typeaheadInput, 'Jim Bob')
      expect(typeaheadInput).toHaveDisplayValue('Jim Bob')
    })

    it('should render a type input box', async () => {
      setup()
      expect(screen.getByText(/labs\.lab\.type/i)).toHaveAttribute(
        'title',
        'This is a required input',
      )
      expect(screen.getByLabelText(/labs\.lab\.type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/labs\.lab\.type/i)).not.toBeDisabled()
    })

    it('should render a notes text field', async () => {
      setup()
      expect(screen.getByLabelText(/labs\.lab\.notes/i)).not.toBeDisabled()
      expect(screen.getByText(/labs\.lab\.notes/i)).not.toHaveAttribute(
        'title',
        'This is a required input',
      )
    })

    it('should render a visit select', async () => {
      setup()
      const selectLabel = screen.getByText(/patient\.visit/i)
      const selectInput = screen.getByPlaceholderText('-- Choose --')

      expect(selectInput).toBeInTheDocument()
      expect(selectInput).toHaveDisplayValue([''])
      expect(selectLabel).toBeInTheDocument()
      expect(selectLabel).not.toHaveAttribute('title', 'This is a required input')
    })

    it('should render a save button', async () => {
      setup()
      expect(screen.getByRole('button', { name: /labs\.requests\.new/i })).toBeInTheDocument()
    })

    it('should render a cancel button', async () => {
      setup()
      expect(screen.getByRole('button', { name: /actions\.cancel/i })).toBeInTheDocument()
    })

    it('should clear visit when patient is changed', async () => {
      setup()
      const typeaheadInput = screen.getByPlaceholderText(/labs.lab.patient/i)
      const visitsInput = screen.getByPlaceholderText('-- Choose --')

      userEvent.type(typeaheadInput, 'Jim Bob')
      expect(await screen.findByText(/Jim Bob/i)).toBeVisible()
      userEvent.click(screen.getByText(/Jim Bob/i))
      expect(typeaheadInput).toHaveDisplayValue(/Jim Bob/i)
      userEvent.click(visitsInput)

      // The visits dropdown should be populated with the patient's visits.
      userEvent.click(
        await screen.findByRole('link', {
          name: `${visits[0].type} at ${format(
            new Date(visits[0].startDateTime),
            'yyyy-MM-dd hh:mm a',
          )}`,
        }),
      )
      expect(visitsInput).toHaveDisplayValue(
        `${visits[0].type} at ${format(new Date(visits[0].startDateTime), 'yyyy-MM-dd hh:mm a')}`,
      )

      userEvent.clear(typeaheadInput)
      // The visits dropdown option should be reset when the patient is changed.
      expect(visitsInput).toHaveDisplayValue('')
      expect(
        screen.queryByRole('link', {
          name: `${visits[0].type} at ${format(
            new Date(visits[0].startDateTime),
            'yyyy-MM-dd hh:mm a',
          )}`,
        }),
      ).not.toBeInTheDocument()
    })
  })

  describe('errors', () => {
    const error = {
      message: 'some message',
      patient: 'some patient message',
      type: 'some type error',
    } as LabError

    beforeAll(() => {
      jest.resetAllMocks()
      jest.spyOn(validationUtil, 'validateLabRequest').mockReturnValue(error)
      expectOneConsoleError(error)
    })

    it('should display errors', async () => {
      setup()
      const saveButton = screen.getByRole('button', { name: /labs\.requests\.new/i })
      await act(async () => {
        userEvent.click(saveButton)
      })
      const alert = screen.findByRole('alert')
      const { getByText: getByTextInAlert } = within(await alert)
      const patientInput = screen.getByPlaceholderText(/labs\.lab\.patient/i)
      const typeInput = screen.getByPlaceholderText(/labs\.lab\.type/i)

      expect(getByTextInAlert(error.message)).toBeInTheDocument()
      expect(getByTextInAlert(/states\.error/i)).toBeInTheDocument()
      expect(await alert).toHaveClass('alert-danger')
      expect(patientInput).toHaveClass('is-invalid')
      expect(typeInput).toHaveClass('is-invalid')
      if (error.type) {
        expect(typeInput.nextSibling).toHaveTextContent(error.type)
      }
    })
  })

  describe('on cancel', () => {
    it('should navigate back to /labs', async () => {
      setup()
      const cancelButton = screen.getByRole('button', { name: /actions\.cancel/i })

      await act(async () => {
        userEvent.click(cancelButton)
      })

      expect(history.location.pathname).toEqual('/labs')
    })
  })

  describe('on save', () => {
    let labRepositorySaveSpy: any
    const store = mockStore({
      lab: { status: 'loading', error: {} },
      user: { user: { id: 'fake id' } },
    } as any)

    const expectedDate = new Date()
    const expectedNotes = 'expected notes'
    const expectedLab = {
      patient: '1234567',
      type: 'expected type',
      status: 'requested',
      notes: [expectedNotes],
      id: '1234',
      requestedOn: expectedDate.toISOString(),
    } as Lab

    const visits = [
      {
        startDateTime: new Date().toISOString(),
        id: 'visit_id',
        type: 'visit_type',
      },
    ] as Visit[]
    const expectedPatient = { id: expectedLab.patient, fullName: 'Billy', visits } as Patient

    beforeAll(() => {
      jest.resetAllMocks()
      jest.spyOn(PatientRepository, 'search').mockResolvedValue([expectedPatient])
      labRepositorySaveSpy = jest.spyOn(LabRepository, 'save').mockResolvedValue(expectedLab as Lab)
    })

    it('should save the lab request and navigate to "/labs/:id"', async () => {
      setup(store)

      userEvent.type(screen.getByPlaceholderText(/labs.lab.patient/i), 'Billy')

      await waitFor(
        () => {
          expect(screen.getByText(/billy/i)).toBeVisible()
        },
        { timeout: 3000 },
      )
      userEvent.click(screen.getByText(/billy/i))
      userEvent.type(screen.getByPlaceholderText(/labs\.lab\.type/i), expectedLab.type)
      userEvent.type(screen.getByLabelText(/labs\.lab\.notes/i), expectedNotes)

      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: /labs\.requests\.new/i }))
      })

      expect(labRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(labRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          patient: expectedLab.patient,
          type: expectedLab.type,
          notes: expectedLab.notes,
          status: 'requested',
        }),
      )
      expect(history.location.pathname).toEqual(`/labs/${expectedLab.id}`)
    })
  })
})
