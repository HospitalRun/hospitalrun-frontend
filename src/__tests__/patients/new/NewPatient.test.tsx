import * as components from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import * as titleUtil from '../../../page-header/title/useTitle'
import GeneralInformation from '../../../patients/GeneralInformation'
import NewPatient from '../../../patients/new/NewPatient'
import * as patientSlice from '../../../patients/patient-slice'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('New Patient', () => {
  const patient = {
    givenName: 'first',
    fullName: 'first',
  } as Patient

  let history: any
  let store: MockStore

  const setup = (error?: any) => {
    jest.spyOn(PatientRepository, 'save')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.save.mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient: {} as Patient, createError: error } } as any)

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

  it('should pass the error object to general information', async () => {
    const expectedError = { message: 'some message' }
    let wrapper: any
    await act(async () => {
      wrapper = await setup(expectedError)
    })
    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('error')).toEqual(expectedError)
  })

  it('should dispatch createPatient when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onChange')(patient)
    })

    wrapper.update()

    const saveButton = wrapper.find('.btn-save').at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(PatientRepository.save).toHaveBeenCalledWith(patient)
    expect(store.getActions()).toContainEqual(patientSlice.createPatientStart())
    expect(store.getActions()).toContainEqual(patientSlice.createPatientSuccess())
  })

  it('should reveal modal (return true) when save button is clicked if an existing patient has the same information', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const saveButton = wrapper.find('.btn-save').at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })
    wrapper.update()

    expect(onClick()).toEqual(true)
  })

  it('should navigate to /patients/:id and display a message after a new patient is successfully created', async () => {
    jest.spyOn(components, 'Toast')
    const mockedComponents = mocked(components, true)
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onChange')(patient)
    })

    wrapper.update()

    const saveButton = wrapper.find('.btn-save').at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(history.location.pathname).toEqual(`/patients/${patient.id}`)
    expect(mockedComponents.Toast).toHaveBeenCalledWith(
      'success',
      'states.success',
      `patients.successfullyCreated ${patient.fullName}`,
    )
  })

  it('should navigate to /patients when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const cancelButton = wrapper.find('.btn-cancel').at(0)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    expect(history.location.pathname).toEqual('/patients')
  })
})
