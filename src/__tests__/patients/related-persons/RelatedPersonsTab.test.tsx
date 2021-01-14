import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
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

  jest
    .spyOn(PatientRepository, 'find')
    .mockImplementation((id: string) =>
      id === expectedRelatedPerson.id
        ? Promise.resolve(expectedRelatedPerson)
        : Promise.resolve(expectedPatient),
    )
  jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
  jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue([])

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
