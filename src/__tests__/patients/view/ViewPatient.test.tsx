import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { mocked } from 'ts-jest/utils'
import { act } from 'react-dom/test-utils'
import { MemoryRouter, Route, BrowserRouter, Router } from 'react-router-dom'
import { TabsHeader, Tab } from '@hospitalrun/components'
import GeneralInformation from 'patients/view/GeneralInformation'
import { createMemoryHistory } from 'history'
import Patient from '../../../model/Patient'
import PatientRepository from '../../../clients/db/PatientRepository'
import * as titleUtil from '../../../page-header/useTitle'
import ViewPatient from '../../../patients/view/ViewPatient'
import store from '../../../store'

describe('ViewPatient', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    friendlyId: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as Patient

  let history = createMemoryHistory()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)
    jest.mock('react-router-dom', () => ({
      useParams: () => ({
        id: '123',
      }),
    }))

    history = createMemoryHistory()
    history.push('/patients/123')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/:id">
            <ViewPatient />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should render a header with the patients given, family, and suffix', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })
    expect(titleUtil.default).toHaveBeenCalledWith(
      `${patient.givenName} ${patient.familyName} ${patient.suffix} (${patient.friendlyId})`,
    )
  })

  it('should render a tabs header with the correct tabs', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const tabsHeader = wrapper.find(TabsHeader)
    const tabs = tabsHeader.find(Tab)
    expect(tabsHeader).toHaveLength(1)

    expect(tabs).toHaveLength(1)
    expect(tabs.at(0).prop('label')).toEqual('patient.generalInformation')
  })

  it('should mark the general information tab as active and render the general information component when route is /patients/:id', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const tabsHeader = wrapper.find(TabsHeader)
    const tabs = tabsHeader.find(Tab)
    const generalInformation = wrapper.find(GeneralInformation)
    expect(tabs.at(0).prop('active')).toBeTruthy()
    expect(generalInformation).toHaveLength(1)
    expect(generalInformation.prop('patient')).toEqual(patient)
  })

  it('should navigate /patients/:id when the general information tab is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const tabsHeader = wrapper.find(TabsHeader)
    const tabs = tabsHeader.find(Tab)
    await act(async () => {
      await (tabs.at(0).prop('onClick') as any)()
    })

    wrapper.update()

    expect(history.location.pathname).toEqual('/patients/123')
  })
})
