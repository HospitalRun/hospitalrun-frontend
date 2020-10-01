import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Dashboard from '../../dashboard/Dashboard'
import HospitalRun from '../../HospitalRun'
import { addBreadcrumbs } from '../../page-header/breadcrumbs/breadcrumbs-slice'
import * as titleUtil from '../../page-header/title/TitleContext'
import EditPatient from '../../patients/edit/EditPatient'
import NewPatient from '../../patients/new/NewPatient'
import * as patientNameUtil from '../../patients/util/patient-util'
import ViewPatient from '../../patients/view/ViewPatient'
import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('/patients/new', () => {
  jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
  it('should render the new patient screen when /patients/new is accessed', async () => {
    const store = mockStore({
      title: 'test',
      user: { user: { id: '123' }, permissions: [Permissions.WritePatients] },
      breadcrumbs: { breadcrumbs: [] },
      patient: {},
      components: { sidebarCollapsed: false },
    } as any)

    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/patients/new']}>
            <TitleProvider>
              <HospitalRun />
            </TitleProvider>
          </MemoryRouter>
        </Provider>,
      )
    })

    wrapper.update()

    expect(wrapper.find(NewPatient)).toHaveLength(1)

    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { i18nKey: 'patients.newPatient', location: '/patients/new' },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard if the user does not have write patient privileges', () => {
    const wrapper = mount(
      <Provider
        store={mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)}
      >
        <MemoryRouter initialEntries={['/patients/new']}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })
})

describe('/patients/edit/:id', () => {
  it('should render the edit patient screen when /patients/edit/:id is accessed', () => {
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

    const store = mockStore({
      title: 'test',
      user: {
        user: { id: '123' },
        permissions: [Permissions.WritePatients, Permissions.ReadPatients],
      },
      patient: { patient },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/patients/edit/123']}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(EditPatient)).toHaveLength(1)

    expect(store.getActions()).toContainEqual({
      ...addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { text: 'test test test', location: `/patients/${patient.id}` },
        { i18nKey: 'patients.editPatient', location: `/patients/${patient.id}/edit` },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    })
  })

  it('should render the Dashboard when the user does not have read patient privileges', () => {
    const wrapper = mount(
      <Provider
        store={mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [Permissions.WritePatients] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)}
      >
        <MemoryRouter initialEntries={['/patients/edit/123']}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })

  it('should render the Dashboard when the user does not have write patient privileges', () => {
    const wrapper = mount(
      <Provider
        store={mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [Permissions.ReadPatients] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)}
      >
        <MemoryRouter initialEntries={['/patients/edit/123']}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(Dashboard)).toHaveLength(1)
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

    const store = mockStore({
      title: 'test',
      user: { user: { id: '123' }, permissions: [Permissions.ReadPatients] },
      patient: { patient },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/patients/123']}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(ViewPatient)).toHaveLength(1)

    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { text: 'test test test', location: `/patients/${patient.id}` },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read patient privileges', () => {
    const wrapper = mount(
      <Provider
        store={mockStore({
          title: 'test',
          user: { user: { id: '123' }, permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)}
      >
        <MemoryRouter initialEntries={['/patients/123']}>
          <TitleProvider>
            <HospitalRun />
          </TitleProvider>
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })
})
