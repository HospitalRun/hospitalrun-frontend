import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as components from '@hospitalrun/components'
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

  const setup = (error?: any) => {
    jest.spyOn(PatientRepository, 'save')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.save.mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient: {} as Patient, createError: error } })

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
      generalInformationForm.prop('onFieldChange')('givenName', 'first')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(PatientRepository.save).toHaveBeenCalledWith(patient)
    expect(store.getActions()).toContainEqual(patientSlice.createPatientStart())
    expect(store.getActions()).toContainEqual(patientSlice.createPatientSuccess())
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
      generalInformationForm.prop('onFieldChange')('givenName', 'first')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
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

    const cancelButton = wrapper.find(components.Button).at(1)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    expect(history.location.pathname).toEqual('/patients')
  })

  it('should pass suffix contains number error when suffix form contains a number on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('errorMessage')).toBe('')

    act(() => {
      generalInformationForm.prop('onFieldChange')('suffix', '1234567890')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.createPatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').suffix).toMatch(
      'patient.errors.patientSuffixFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })

  it('should pass prefix contains number error when prefix form contains a number on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('errorMessage')).toBe('')

    act(() => {
      generalInformationForm.prop('onFieldChange')('prefix', '1234567890')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.createPatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').prefix).toMatch(
      'patient.errors.patientPrefixFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })

  it('should pass family name contains number error when family name form contains a number on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('errorMessage')).toBe('')

    act(() => {
      generalInformationForm.prop('onFieldChange')('familyName', '1234567890')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.createPatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').familyName).toMatch(
      'patient.errors.patientFamilyNameFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })

  it('should pass preferred language contains number error when preferred language form contains a number on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('errorMessage')).toBe('')

    act(() => {
      generalInformationForm.prop('onFieldChange')('preferredLanguage', '1234567890')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.createPatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').preferredLanguage).toMatch(
      'patient.errors.patientPreferredLanguageFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })

  it('should pass given name contains number error when given name form contains a number on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)
    expect(generalInformationForm.prop('errorMessage')).toBe('')

    act(() => {
      generalInformationForm.prop('onFieldChange')('givenName', '1234567890')
    })

    wrapper.update()

    const saveButton = wrapper.find(components.Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.createPatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').givenName).toMatch(
      'patient.errors.patientGivenNameContainNumFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })
})
