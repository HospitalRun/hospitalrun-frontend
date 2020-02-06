import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Router, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import NewPatient from '../../../patients/new/NewPatient'
import GeneralInformation from '../../../patients/GeneralInformation'
import store from '../../../store'
import Patient from '../../../model/Patient'
import * as patientSlice from '../../../patients/patient-slice'
import * as titleUtil from '../../../page-header/useTitle'
import PatientRepository from '../../../clients/db/PatientRepository'

describe('New Patient', () => {
  it('should render a general information form', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NewPatient />
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(GeneralInformation)).toHaveLength(1)
  })

  it('should use "New Patient" as the header', () => {
    jest.spyOn(titleUtil, 'default')
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <NewPatient />
        </MemoryRouter>
      </Provider>,
    )

    expect(titleUtil.default).toHaveBeenCalledWith('patients.newPatient')
  })

  it('should call create patient when save button is clicked', async () => {
    jest.spyOn(patientSlice, 'createPatient')
    jest.spyOn(PatientRepository, 'save')
    const mockedPatientRepository = mocked(PatientRepository, true)
    const patient = {
      fullName: '',
    } as Patient
    mockedPatientRepository.save.mockResolvedValue(patient)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NewPatient />
        </MemoryRouter>
      </Provider>,
    )

    const generalInformationForm = wrapper.find(GeneralInformation)
    await generalInformationForm.prop('onSave')()
    expect(patientSlice.createPatient).toHaveBeenCalledWith(patient, expect.anything())
  })

  it('should navigate to /patients when cancel is clicked', () => {
    const history = createMemoryHistory()
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <NewPatient />
        </Router>
      </Provider>,
    )

    act(() => {
      wrapper.find(GeneralInformation).prop('onCancel')()
    })

    wrapper.update()

    expect(history.location.pathname).toEqual('/patients')
  })
})
