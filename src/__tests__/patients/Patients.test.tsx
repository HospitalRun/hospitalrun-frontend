import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import HospitalRun from '../../HospitalRun'
import { addBreadcrumbs } from '../../page-header/breadcrumbs/breadcrumbs-slice'
import * as titleUtil from '../../page-header/title/TitleContext'
import * as patientNameUtil from '../../patients/util/patient-util'
import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

const setup = (url: string, permissions: Permissions[] = []) => {
  const store = mockStore({
    user: { user: { id: '123' }, permissions },
    breadcrumbs: { breadcrumbs: [] },
    patient: {},
    components: { sidebarCollapsed: false },
  } as any)
  const history = createMemoryHistory({ initialEntries: [url] })

  return {
    store,
    history,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </Router>
      </Provider>,
    ),
  }
}

describe('/patients/new', () => {
  it('sould render the new patient screen when /patients/new is accessed', async () => {
    const { store } = setup('/patients/new', [Permissions.WritePatients])

    expect(
      await screen.findByRole('heading', { name: /patients\.newPatient/i }),
    ).toBeInTheDocument()

    // TODO: Figure out how to select these in the dom instead of checking the store
    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { i18nKey: 'patients.newPatient', location: '/patients/new' },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard if the user does not have write patient privileges', async () => {
    setup('/patients/new')

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })
})

describe('/patients/edit/:id', () => {
  it('should render the edit patient screen when /patients/edit/:id is accessed', async () => {
    const patient = {
      id: '123',
      prefix: 'test',
      givenName: 'test',
      familyName: 'test',
      suffix: 'test',
      code: 'P00001',
    } as Patient

    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest
      .spyOn(patientNameUtil, 'getPatientFullName')
      .mockReturnValue(`${patient.prefix} ${patient.givenName} ${patient.familyName}`)

    const { store } = setup('/patients/edit/123', [
      Permissions.WritePatients,
      Permissions.ReadPatients,
    ])

    expect(
      await screen.findByRole('heading', { name: /patients\.editPatient/i }),
    ).toBeInTheDocument()

    // TODO: Figure out how to select these in the dom instead of checking the store
    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { text: 'test test test', location: `/patients/${patient.id}` },
        { i18nKey: 'patients.editPatient', location: `/patients/${patient.id}/edit` },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read patient privileges', async () => {
    setup('/patients/edit/123', [Permissions.WritePatients])

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })

  it('should render the Dashboard when the user does not have write patient privileges', async () => {
    setup('/patients/edit/123', [Permissions.ReadPatients])

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })
})

describe('/patients/:id', () => {
  it('should render the view patient screen when /patients/:id is accessed', async () => {
    const patient = {
      id: '123',
      prefix: 'test',
      givenName: 'test',
      familyName: 'test',
      suffix: 'test',
      code: 'P00001',
    } as Patient

    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const { store } = setup('/patients/123', [Permissions.ReadPatients])

    expect(await screen.findByRole('heading', { name: /patient\.label/i })).toBeInTheDocument()

    // TODO: Figure out how to select these in the dom instead of checking the store
    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { text: 'test test test', location: `/patients/${patient.id}` },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read patient privileges', async () => {
    setup('/patients/123')

    expect(await screen.findByRole('heading', { name: /dashboard\.label/i })).toBeInTheDocument()
  })
})
