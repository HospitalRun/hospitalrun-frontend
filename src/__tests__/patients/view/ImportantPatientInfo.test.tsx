import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewDiagnosis from '../../../patients/diagnoses/ViewDiagnosis'
import ImportantPatientInfo from '../../../patients/view/ImportantPatientInfo'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan from '../../../shared/model/CarePlan'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Important Patient Info Panel', () => {
  let history: any
  let user: any
  let store: any

  const diagnosis = {
    id: 'diagnosisId',
    name: 'diagnosis1',
    diagnosisDate: new Date().toISOString(),
  } as Diagnosis

  const expectedPatient = {
    id: '123',
    sex: 'male',
    fullName: 'full Name',
    code: 'P-123',
    dateOfBirth: format(new Date(), 'MM/dd/yyyy'),
    diagnoses: [diagnosis],
    allergies: [
      { id: '1', name: 'allergy1' },
      { id: '2', name: 'allergy2' },
    ],
    carePlans: [
      {
        id: '123',
        title: 'title1',
        description: 'test',
        diagnosisId: '12345',
        status: 'status' as string,
        intent: 'intent' as string,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        createdOn: new Date().toISOString(),
        note: 'note',
      } as CarePlan,
    ],
  } as Patient

  const setup = (patient = expectedPatient, permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    history = createMemoryHistory()
    user = { permissions }
    store = mockStore({ patient, user } as any)

    return render(
      <Provider store={store}>
        <Router history={history}>
          <ImportantPatientInfo patient={patient} />
          <Switch>
            <Route exact path="/patients/:id/diagnoses/:diagnosisId">
              <ViewDiagnosis />
            </Route>
          </Switch>
        </Router>
      </Provider>,
    )
  }

  describe("patient's full name, patient's code, sex, and date of birth", () => {
    it("should render patient's full name", async () => {
      setup(expectedPatient, [])
      if (typeof expectedPatient.fullName !== 'undefined') {
        expect(screen.getByText(expectedPatient.fullName)).toBeInTheDocument()
      }
    })

    it("should render patient's code", () => {
      setup(expectedPatient, [])
      expect(screen.getByText(expectedPatient.code)).toBeInTheDocument()
    })

    it("should render patient's sex", () => {
      setup(expectedPatient, [])
      expect(screen.getByText(expectedPatient.sex)).toBeInTheDocument()
    })

    it("should render patient's dateOfDate", () => {
      setup(expectedPatient, [])
      expect(screen.getAllByText(expectedPatient.dateOfBirth)[0]).toBeInTheDocument()
    })
  })

  describe('add new visit button', () => {
    it('should render an add visit button if user has correct permissions', () => {
      setup(expectedPatient, [Permissions.AddVisit])
      expect(screen.getByRole('button', { name: /patient.visits.new/i })).toBeInTheDocument()
    })

    it('should open the add visit modal on click', async () => {
      setup(expectedPatient, [Permissions.AddVisit])
      userEvent.click(screen.getByText(/patient.visits.new/i))
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
      const { getByText: getByTextModal } = within(screen.getByRole('dialog'))
      expect(getByTextModal(/patient.visits.new/i, { selector: 'div' })).toBeInTheDocument()
    })

    it('should close the modal when the close button is clicked', async () => {
      setup(expectedPatient, [Permissions.AddVisit])
      userEvent.click(screen.getByText(/patient.visits.new/i))
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
      const { getAllByRole: getAllByRoleModal } = within(screen.getByRole('dialog'))
      userEvent.click(getAllByRoleModal('button')[0])
      expect(await screen.findByRole('dialog')).not.toBeInTheDocument()
    })

    it('should not render new visit button if user does not have permissions', () => {
      setup(expectedPatient, [])
      expect(screen.queryByRole('button', { name: /patient.visits.new/i })).not.toBeInTheDocument()
    })
  })

  describe('add new allergy button', () => {
    it('should render an add allergy button if user has correct permissions', () => {
      setup(expectedPatient, [Permissions.AddAllergy])
      expect(screen.getByRole('button', { name: /patient.allergies.new/i })).toBeInTheDocument()
    })

    it('should open the add allergy modal on click', async () => {
      setup(expectedPatient, [Permissions.AddAllergy])
      userEvent.click(screen.getByRole('button', { name: /patient.allergies.new/i }))
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
      const { getByLabelText: getByLabelTextModal } = within(screen.getByRole('dialog'))
      expect(getByLabelTextModal(/patient.allergies.allergyName/i)).toBeInTheDocument()
    })

    it('should close the modal when the close button is clicked', async () => {
      setup(expectedPatient, [Permissions.AddAllergy])
      userEvent.click(screen.getByRole('button', { name: /patient.allergies.new/i }))
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
      const { getAllByRole: getAllByRoleModal } = within(screen.getByRole('dialog'))
      userEvent.click(getAllByRoleModal('button')[0])
      expect(await screen.findByRole('dialog')).not.toBeInTheDocument()
    })

    it('should not render new allergy button if user does not have permissions', () => {
      setup(expectedPatient, [])
      expect(
        screen.queryByRole('button', { name: /patient.allergies.new/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('add diagnoses button', () => {
    it('should render an add diagnosis button if user has correct permissions', () => {
      setup(expectedPatient, [Permissions.AddDiagnosis])
      expect(screen.getByRole('button', { name: /patient.diagnoses.new/i })).toBeInTheDocument()
    })

    it('should open the add diagnosis modal on click', async () => {
      setup(expectedPatient, [Permissions.AddDiagnosis])
      userEvent.click(screen.getByRole('button', { name: /patient.diagnoses.new/i }))
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
      const { getByLabelText: getByLabelTextModal } = within(screen.getByRole('dialog'))
      expect(getByLabelTextModal(/patient.diagnoses.diagnosisName/i)).toBeInTheDocument()
    })

    it('should close the modal when the close button is clicked', async () => {
      setup(expectedPatient, [Permissions.AddDiagnosis])
      userEvent.click(screen.getByRole('button', { name: /patient.diagnoses.new/i }))
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
      const { getAllByRole: getAllByRoleModal } = within(screen.getByRole('dialog'))
      userEvent.click(getAllByRoleModal('button')[0])
      expect(await screen.findByRole('dialog')).not.toBeInTheDocument()
    })

    it('should not render new diagnosis button if user does not have permissions', () => {
      setup(expectedPatient, [])
      expect(
        screen.queryByRole('button', { name: /patient.diagnoses.new/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('patient diagnosis routing', () => {
    it('should render the diagnosis form when the table row is clicked', async () => {
      setup(expectedPatient, [])

      const rows = await screen.findAllByRole('row')
      userEvent.click(rows[2])
      expect(history.location.pathname).toEqual(
        `/patients/${expectedPatient.id}/diagnoses/${diagnosis.id}`,
      )

      const form = await screen.findByRole('form')
      expect(
        within(form).getByPlaceholderText(/patient.diagnoses.diagnosisName/i),
      ).toBeInTheDocument()
    })
  })
})
