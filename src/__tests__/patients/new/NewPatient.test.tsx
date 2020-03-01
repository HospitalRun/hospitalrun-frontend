import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import { Button } from '@hospitalrun/components'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import NewPatient from '../../../patients/new/NewPatient'
import GeneralInformation from '../../../patients/GeneralInformation'
import Patient from '../../../model/Patient'
import * as patientSlice from '../../../patients/patient-slice'
import * as titleUtil from '../../../page-header/useTitle'
import PatientRepository from '../../../clients/db/PatientRepository'

const mockStore = configureMockStore([thunk])

describe('New Patient', () => {
  const patient = {
    givenName: 'first',
    fullName: 'first',
  } as Patient

  let history: any
  let store: MockStore

  const setup = () => {
    jest.spyOn(PatientRepository, 'save')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.save.mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient: {} as Patient } })

    history.push('/patients/new')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/new">
            <NewPatient />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a general information form', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    expect(wrapper.find(GeneralInformation)).toHaveLength(1)
  })

  it('should use "New Patient" as the header', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })

    expect(titleUtil.default).toHaveBeenCalledWith('patients.newPatient')
  })

  it('should pass no given name error when form doesnt contain a given name on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const givenName = wrapper.findWhere((w: any) => w.prop('name') === 'givenName')
    expect(givenName.prop('value')).toBe('')

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('errorMessage')).toBe('')

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.patientGivenNameRequired',
    )
  })

  it('should dispatch createPatient when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onFieldChange')('givenName', 'first')
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(PatientRepository.save).toHaveBeenCalledWith(patient)
    expect(store.getActions()).toContainEqual(patientSlice.createPatientStart())
    expect(store.getActions()).toContainEqual(patientSlice.createPatientSuccess())
  })

  it('should navigate to /patients when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const cancelButton = wrapper.find(Button).at(1)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    expect(history.location.pathname).toEqual('/patients')
  })
})
