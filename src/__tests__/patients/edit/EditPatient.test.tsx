import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import EditPatient from '../../../patients/edit/EditPatient'
import GeneralInformation from '../../../patients/GeneralInformation'
import Patient from '../../../model/Patient'
import * as patientSlice from '../../../patients/patient-slice'
import * as titleUtil from '../../../page-header/useTitle'
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
    friendlyId: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as Patient

  let history = createMemoryHistory()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)

    history = createMemoryHistory()
    history.push('/patients/edit/123')
    const wrapper = mount(
      <Provider
        store={mockStore({
          patient: { patient },
        })}
      >
        <Router history={history}>
          <Route path="/patients/edit/123">
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

  it('should use "Edit Patient: " plus patient full name as the title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup()
    })
    expect(titleUtil.default).toHaveBeenCalledWith(
      'patients.editPatient: givenName familyName suffix (P00001)',
    )
  })

  it('should call update patient when save button is clicked', async () => {
    jest.spyOn(patientSlice, 'updatePatient')
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.saveOrUpdate.mockResolvedValue(patient)

    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)
    await generalInformationForm.prop('onSave')(patient)
    expect(patientSlice.updatePatient).toHaveBeenCalledWith(patient, expect.anything())
  })

  // should check that it's navigating to '/patients/:id' but can't figure out how to mock
  // useParams to get the id
  // it('should navigate to /patients when cancel is clicked', async () => {
  //   let wrapper: any
  //   await act(async () => {
  //     wrapper = await setup()
  //   })

  //   act(() => {
  //     wrapper.find(GeneralInformation).prop('onCancel')()
  //   })

  //   wrapper.update()
  //   expect(history.location.pathname).toEqual('/patients')
  // })
})
