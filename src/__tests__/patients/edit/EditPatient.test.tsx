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
import { Button } from '@hospitalrun/components'
import { addDays, endOfToday } from 'date-fns'
import EditPatient from '../../../patients/edit/EditPatient'
import GeneralInformation from '../../../patients/GeneralInformation'
import Patient from '../../../model/Patient'
import * as titleUtil from '../../../page-header/useTitle'
import * as patientSlice from '../../../patients/patient-slice'
import PatientRepository from '../../../clients/db/PatientRepository'

const mockStore = configureMockStore([thunk])

describe('Edit Patient', () => {
  const patient = {
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    fullName: 'givenName familyName suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    code: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as Patient

  let history: any
  let store: MockStore

  const setup = () => {
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    jest.spyOn(PatientRepository, 'find')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)
    mockedPatientRepository.saveOrUpdate.mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient } })

    history.push('/patients/edit/123')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/edit/:id">
            <EditPatient />
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

  it('should render an edit patient form', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    expect(wrapper.find(GeneralInformation)).toHaveLength(1)
  })

  it('should dispatch fetchPatient when component loads', async () => {
    await act(async () => {
      await setup()
    })

    expect(PatientRepository.find).toHaveBeenCalledWith(patient.id)
    expect(store.getActions()).toContainEqual(patientSlice.fetchPatientStart())
    expect(store.getActions()).toContainEqual(patientSlice.fetchPatientSuccess(patient))
  })

  it('should use "Edit Patient: " plus patient full name as the title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })
    expect(titleUtil.default).toHaveBeenCalledWith(
      'patients.editPatient: givenName familyName suffix (P00001)',
    )
  })

  it('should dispatch updatePatient when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(patient)
    expect(store.getActions()).toContainEqual(patientSlice.updatePatientStart())
    expect(store.getActions()).toContainEqual(patientSlice.updatePatientSuccess(patient))
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
      'patient.errors.updatePatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').givenName).toMatch(
      'patient.errors.patientGivenNameFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })

  it('should pass invalid date of birth error when input date is grater than today on save button click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onFieldChange')(
        'dateOfBirth',
        addDays(endOfToday(), 10).toISOString(),
      )
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    wrapper.update()
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.updatePatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').dateOfBirth).toMatch(
      'patient.errors.patientDateOfBirthFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })

  it('should navigate to /patients/:id when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const cancelButton = wrapper.find(Button).at(1)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    wrapper.update()
    expect(history.location.pathname).toEqual('/patients/123')
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

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.updatePatientError',
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

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.updatePatientError',
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

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.updatePatientError',
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

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.updatePatientError',
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

    const saveButton = wrapper.find(Button).at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    act(() => {
      onClick()
    })

    wrapper.update()
    console.log(wrapper.find(GeneralInformation).prop('feedbackFields'))
    expect(wrapper.find(GeneralInformation).prop('errorMessage')).toMatch(
      'patient.errors.updatePatientError',
    )
    expect(wrapper.find(GeneralInformation).prop('feedbackFields').givenName).toMatch(
      'patient.errors.patientGivenNameContainNumFeedback',
    )
    expect(wrapper.update.isInvalid === true)
  })
})
