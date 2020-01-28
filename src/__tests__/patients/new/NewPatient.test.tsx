import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Router, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { mocked } from 'ts-jest/utils'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import NewPatient from '../../../patients/new/NewPatient'
import NewPatientForm from '../../../patients/new/NewPatientForm'
import store from '../../../store'
import Patient from '../../../model/Patient'
import * as patientSlice from '../../../patients/patients-slice'
import * as titleUtil from '../../../page-header/useTitle'
import PatientRepository from '../../../clients/db/PatientRepository'

describe('New Patient', () => {
  it('should render a new patient form', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NewPatient />
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper.find(NewPatientForm)).toHaveLength(1)
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
      id: '123',
      prefix: 'test',
      givenName: 'test',
      familyName: 'test',
      suffix: 'test',
    } as Patient
    mockedPatientRepository.save.mockResolvedValue(patient)

    const expectedPatient = {
      sex: 'male',
      givenName: 'givenName',
      familyName: 'familyName',
    } as Patient

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NewPatient />
        </MemoryRouter>
      </Provider>,
    )

    const newPatientForm = wrapper.find(NewPatientForm)

    await newPatientForm.prop('onSave')(expectedPatient)

    expect(patientSlice.createPatient).toHaveBeenCalledWith(expectedPatient, expect.anything())
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
      wrapper.find(NewPatientForm).prop('onCancel')()
    })

    wrapper.update()

    expect(history.location.pathname).toEqual('/patients')
  })
})
