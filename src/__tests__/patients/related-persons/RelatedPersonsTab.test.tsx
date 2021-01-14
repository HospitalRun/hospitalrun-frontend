import { render, screen, within, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import RelatedPersonTab from '../../../patients/related-persons/RelatedPersonTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import RelatedPerson from '../../../shared/model/RelatedPerson'
import { RootState } from '../../../shared/store'
import { expectOneConsoleError } from '../../test-utils/console.utils'

const mockStore = createMockStore<RootState, any>([thunk])

const setup = ({
  permissions = [Permissions.WritePatients, Permissions.ReadPatients],
  patientOverrides = {},
}: {
  permissions?: Permissions[]
  patientOverrides?: Partial<Patient>
} = {}) => {
  const expectedPatient = {
    id: '123',
    rev: '123',
    ...patientOverrides,
  } as Patient
  const expectedRelatedPerson = {
    givenName: 'Related',
    familyName: 'Patient',
    id: '123001',
  } as Patient
  const newRelatedPerson = {
    id: 'patient2',
    fullName: 'fullName2',
    givenName: 'Patient',
    familyName: 'PatientFamily',
    code: 'code2',
  } as Patient

  jest.spyOn(PatientRepository, 'find').mockImplementation(async (id: string) => {
    if (id === expectedRelatedPerson.id) {
      return expectedRelatedPerson
    }
    if (id === newRelatedPerson.id) {
      return newRelatedPerson
    }
    return expectedPatient
  })
  jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
  jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue([])
  jest.spyOn(PatientRepository, 'search').mockResolvedValue([newRelatedPerson])
  jest.spyOn(PatientRepository, 'count').mockResolvedValue(1)

  const history = createMemoryHistory({ initialEntries: ['/patients/123/relatedpersons'] })
  const store = mockStore({
    user: {
      permissions,
    },
    patient: {},
  } as any)

  return {
    expectedPatient,
    expectedRelatedPerson,
    newRelatedPerson,
    history,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id">
            <RelatedPersonTab patient={expectedPatient} />
          </Route>
        </Router>
      </Provider>,
    ),
  }
}

describe('Related Persons Tab', () => {
  describe('Add New Related Person', () => {
    it('should render a New Related Person button', async () => {
      setup()

      expect(await screen.findByRole('button', { name: /patient\.relatedPersons\.add/i }))
    })

    it('should not render a New Related Person button if the user does not have write privileges for a patient', async () => {
      const { container } = setup({ permissions: [Permissions.ReadPatients] })

      // wait for spinner to disappear
      await waitForElementToBeRemoved(container.querySelector(`[class^='css']`))

      expect(
        screen.queryByRole('button', { name: /patient\.relatedPersons\.add/i }),
      ).not.toBeInTheDocument()
    })

    it('should show the New Related Person modal when the New Related Person button is clicked', async () => {
      setup()

      userEvent.click(await screen.findByRole('button', { name: /patient\.relatedPersons\.add/i }))

      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })

    it('should render a modal with expected input fields', async () => {
      setup()

      userEvent.click(await screen.findByRole('button', { name: /patient\.relatedPersons\.add/i }))
      const modal = await screen.findByRole('dialog')

      expect(modal).toBeInTheDocument()
      expect(within(modal).getByPlaceholderText(/^patient.relatedPerson$/i)).toBeInTheDocument()

      const relationshipTypeInput = within(modal).getByLabelText(
        /^patient.relatedPersons.relationshipType$/i,
      )
      expect(relationshipTypeInput).toBeInTheDocument()
      expect(relationshipTypeInput).not.toBeDisabled()
      expect(within(modal).getByRole('button', { name: /close/i })).toBeInTheDocument()
      expect(
        within(modal).getByRole('button', { name: /patient.relatedPersons.add/i }),
      ).toBeInTheDocument()
    })

    it('should render the error when there is an error saving', async () => {
      setup()

      userEvent.click(await screen.findByRole('button', { name: /patient\.relatedPersons\.add/i }))
      const modal = await screen.findByRole('dialog')
      const expectedErrorMessage = 'patient.relatedPersons.error.unableToAddRelatedPerson'
      const expectedError = {
        relatedPersonError: 'patient.relatedPersons.error.relatedPersonRequired',
        relationshipTypeError: 'patient.relatedPersons.error.relationshipTypeRequired',
      }
      expectOneConsoleError(expectedError)

      userEvent.click(within(modal).getByRole('button', { name: /patient.relatedPersons.add/i }))
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument()
      expect(screen.getByText(/states.error/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/^patient.relatedPerson$/i)).toHaveClass('is-invalid')
      expect(screen.getByLabelText(/^patient.relatedPersons.relationshipType$/i)).toHaveClass(
        'is-invalid',
      )
      expect(screen.getByText(expectedError.relatedPersonError)).toBeInTheDocument()
      expect(screen.getByText(expectedError.relationshipTypeError)).toBeInTheDocument()
    })

    it('should add a related person to the table with the correct data', async () => {
      const { newRelatedPerson } = setup()

      userEvent.click(screen.getByRole('button', { name: /patient\.relatedPersons\.add/i }))
      const modal = await screen.findByRole('dialog')

      userEvent.type(
        within(modal).getByPlaceholderText(/^patient.relatedPerson$/i),
        newRelatedPerson.fullName as string,
      )

      userEvent.click(await within(modal).findByText(/^fullname2/i))

      userEvent.type(
        within(modal).getByLabelText(/^patient.relatedPersons.relationshipType$/i),
        'new relationship',
      )

      userEvent.click(within(modal).getByRole('button', { name: /patient.relatedPersons.add/i }))

      await waitFor(() => {
        expect(screen.getByRole('cell', { name: newRelatedPerson.familyName })).toBeInTheDocument()
        expect(screen.getByRole('cell', { name: newRelatedPerson.givenName })).toBeInTheDocument()
        expect(screen.getByRole('cell', { name: /new relationship/i })).toBeInTheDocument()
      })
    }, 30000)
  })

  describe('Table', () => {
    const relationShipType = 'Sibling'
    const patientOverrides = {
      relatedPersons: [{ patientId: '123001', type: relationShipType } as RelatedPerson],
    }

    it('should render a list of related persons with their full name being displayed', async () => {
      const { expectedRelatedPerson } = setup({ patientOverrides })

      expect(await screen.findByRole('table')).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /patient\.givenName/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /patient\.familyName/i })).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /patient\.relatedPersons\.relationshipType/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /actions\.label/i })).toBeInTheDocument()

      expect(
        screen.getByRole('cell', { name: expectedRelatedPerson.givenName as string }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('cell', { name: expectedRelatedPerson.familyName as string }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: relationShipType })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: /actions\.view/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /actions\.delete/i })).toBeInTheDocument()
    })

    it('should remove the related person when the delete button is clicked', async () => {
      setup({ patientOverrides })

      userEvent.click(await screen.findByRole('button', { name: /actions\.delete/i }))

      expect(
        await screen.findByText(/patient\.relatedPersons\.warning\.noRelatedPersons/i),
      ).toBeInTheDocument()
    })

    it('should navigate to related person patient profile on related person click', async () => {
      const { history } = setup({ patientOverrides })

      userEvent.click(await screen.findByRole('button', { name: /actions\.view/i }))

      expect(history.location.pathname).toEqual('/patients/123001')
    })
  })

  it('should display a warning if patient has no related persons', async () => {
    setup()

    expect(
      await screen.findByText(/patient\.relatedPersons\.warning\.noRelatedPersons/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/patient\.relatedPersons\.addRelatedPersonAbove/i),
    ).toBeInTheDocument()
  })
})
