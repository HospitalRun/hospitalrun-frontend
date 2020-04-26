import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import configureMockStore from 'redux-mock-store'
import { mount } from 'enzyme'
import thunk from 'redux-thunk'
import { act } from 'react-dom/test-utils'
import Permissions from '../../model/Permissions'
import HospitalRun from '../../HospitalRun'
import NewPatient from '../../patients/new/NewPatient'
import { addBreadcrumbs } from '../../breadcrumbs/breadcrumbs-slice'
import Dashboard from '../../dashboard/Dashboard'
import PatientRepository from '../../clients/db/PatientRepository'
import Patient from '../../model/Patient'
import EditPatient from '../../patients/edit/EditPatient'
import ViewPatient from '../../patients/view/ViewPatient'

const mockStore = configureMockStore([thunk])

describe('/patients/new', () => {
  it('should render the new patient screen when /patients/new is accessed', async () => {
    const store = mockStore({
      title: 'test',
      user: { permissions: [Permissions.WritePatients] },
      patient: {},
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    })

    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/patients/new']}>
            <HospitalRun />
          </MemoryRouter>
        </Provider>,
      )
    })

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
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })}
      >
        <MemoryRouter initialEntries={['/patients/new']}>
          <HospitalRun />
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

    const store = mockStore({
      title: 'test',
      user: { permissions: [Permissions.WritePatients, Permissions.ReadPatients] },
      patient: { patient },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    })

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/patients/edit/123']}>
          <HospitalRun />
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(EditPatient)).toHaveLength(1)

    expect(store.getActions()).toContainEqual(
      addBreadcrumbs([
        { i18nKey: 'patients.label', location: '/patients' },
        { text: 'test test test', location: `/patients/${patient.id}` },
        { i18nKey: 'patients.editPatient', location: `/patients/${patient.id}/edit` },
        { i18nKey: 'dashboard.label', location: '/' },
      ]),
    )
  })

  it('should render the Dashboard when the user does not have read patient privileges', () => {
    const wrapper = mount(
      <Provider
        store={mockStore({
          title: 'test',
          user: { permissions: [Permissions.WritePatients] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })}
      >
        <MemoryRouter initialEntries={['/patients/edit/123']}>
          <HospitalRun />
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
          user: { permissions: [Permissions.ReadPatients] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })}
      >
        <MemoryRouter initialEntries={['/patients/edit/123']}>
          <HospitalRun />
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
      user: { permissions: [Permissions.ReadPatients] },
      patient: { patient },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
    })

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/patients/123']}>
          <HospitalRun />
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
          user: { permissions: [] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        })}
      >
        <MemoryRouter initialEntries={['/patients/123']}>
          <HospitalRun />
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(Dashboard)).toHaveLength(1)
  })
})
