import { Toaster } from '@hospitalrun/components'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
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

const setup = (
  store = mockStore({
    title: '',
    user: { user: { id: 'userId' } },
  } as any),
) => {
  const expectedDate = new Date()
  const expectedNotes = {
    id: 'test-note-id',
    date: new Date().toISOString(),
    text: 'Hi, this is an example test note',
    deleted: false,
  }

  const expectedLab = {
    patient: '1234567',
    type: 'expected type',
    status: 'requested',
    notes: [expectedNotes],
    id: '1234',
    requestedOn: expectedDate.toISOString(),
  } as Lab

  const expectedVisits = [
    {
      startDateTime: new Date().toISOString(),
      id: 'visit_id',
      type: 'visit_type',
    },
  ] as Visit[]
  const expectedPatient = {
    id: expectedLab.patient,
    givenName: 'Jim',
    familyName: 'Bob',
    fullName: 'Jim Bob',
    visits: expectedVisits,
  } as Patient

  jest.resetAllMocks()
  jest.spyOn(PatientRepository, 'search').mockResolvedValue([expectedPatient])
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
  jest.spyOn(LabRepository, 'save').mockResolvedValue(expectedLab)

  const history = createMemoryHistory({ initialEntries: ['/labs/new'] })

  return {
    history,
    expectedLab,
    expectedPatient,
    expectedVisits,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <titleUtil.TitleProvider>
            <NewLabRequest />
          </titleUtil.TitleProvider>
        </Router>
        <Toaster draggable hideProgressBar />
      </Provider>,
    ),
  }
}

describe('New Lab Request', () => {
  describe('form layout', () => {
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
      const selectInput = within(screen.getByTestId('visitSelect')).getByRole('combobox')

      expect(selectInput).toBeInTheDocument()
      expect(selectInput).toHaveDisplayValue([''])
      expect(selectLabel).toBeInTheDocument()
      expect(selectLabel).toHaveAttribute('title', 'This is a required input')
    })

    it('should render a save button', () => {
      setup()

      expect(screen.getByRole('button', { name: /labs\.requests\.new/i })).toBeInTheDocument()
    })

    it('should render a cancel button', () => {
      setup()

      expect(screen.getByRole('button', { name: /actions\.cancel/i })).toBeInTheDocument()
    })

    it('should clear visit when patient is changed', async () => {
      const { expectedVisits } = setup()

      const patientTypeahead = screen.getByPlaceholderText(/labs.lab.patient/i)
      const visitsInput = within(screen.getByTestId('visitSelect')).getByRole('combobox')
      userEvent.type(patientTypeahead, 'Jim Bob')
      userEvent.click(await screen.findByText(/Jim Bob/i))
      expect(patientTypeahead).toHaveDisplayValue(/Jim Bob/i)

      userEvent.click(visitsInput)
      // The visits dropdown should be populated with the patient's visits.
      userEvent.click(
        await screen.findByRole('link', {
          name: `${expectedVisits[0].type} at ${format(
            new Date(expectedVisits[0].startDateTime),
            'yyyy-MM-dd hh:mm a',
          )}`,
        }),
      )
      expect(visitsInput).toHaveDisplayValue(
        `${expectedVisits[0].type} at ${format(
          new Date(expectedVisits[0].startDateTime),
          'yyyy-MM-dd hh:mm a',
        )}`,
      )

      userEvent.clear(patientTypeahead)
      await waitFor(() => {
        // The visits dropdown option should be reset when the patient is changed.
        expect(visitsInput).toHaveDisplayValue('')
      })
      expect(
        screen.queryByRole('link', {
          name: `${expectedVisits[0].type} at ${format(
            new Date(expectedVisits[0].startDateTime),
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

    it('should display errors', async () => {
      setup()
      jest.spyOn(validationUtil, 'validateLabRequest').mockReturnValue(error)
      expectOneConsoleError(error)
      const saveButton = screen.getByRole('button', { name: /labs\.requests\.new/i })

      userEvent.click(saveButton)

      const alert = await screen.findByRole('alert')
      const patientInput = screen.getByPlaceholderText(/labs\.lab\.patient/i)
      const typeInput = screen.getByLabelText(/labs\.lab\.type/i)

      expect(within(alert).getByText(error.message)).toBeInTheDocument()
      expect(within(alert).getByText(/states\.error/i)).toBeInTheDocument()
      expect(alert).toHaveClass('alert-danger')
      expect(patientInput).toHaveClass('is-invalid')
      expect(typeInput).toHaveClass('is-invalid')
      expect(typeInput.nextSibling).toHaveTextContent(error.type as string)
    })
  })

  describe('on cancel', () => {
    it('should navigate back to /labs', async () => {
      const { history } = setup()

      userEvent.click(await screen.findByRole('button', { name: /actions\.cancel/i }))

      expect(history.location.pathname).toEqual('/labs')
    })
  })

  describe('on save', () => {
    it('should save the lab request and navigate to "/labs/:id"', async () => {
      const { expectedLab, history } = setup()

      userEvent.type(screen.getByPlaceholderText(/labs.lab.patient/i), 'Jim Bob')
      expect(await screen.findByText(/jim bob/i)).toBeVisible()
      userEvent.click(screen.getByText(/jim bob/i))
      userEvent.type(screen.getByLabelText(/labs\.lab\.type/i), expectedLab.type)
      userEvent.type(screen.getByLabelText(/labs\.lab\.notes/i), expectedLab?.notes?.[0].text)
      userEvent.click(screen.getByRole('button', { name: /labs\.requests\.new/i }))

      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(
        within(screen.getByRole('alert')).getByText(/labs\.successfullyCreated/i),
      ).toBeInTheDocument()
      expect(history.location.pathname).toEqual(`/labs/${expectedLab.id}`)
    }, 15000)
  })
})
