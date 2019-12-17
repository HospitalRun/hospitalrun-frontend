import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import NewPatient from '../../../patients/new/NewPatient'
import NewPatientForm from '../../../patients/new/NewPatientForm'
import store from '../../../store'
import Patient from '../../../model/Patient'
import Name from '../../../model/Name'
import * as patientSlice from '../../../patients/patients-slice'
import * as titleUtil from '../../../util/useTitle'

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
    const expectedName = new Name('prefix', 'given', 'family', 'suffix')
    const expectedPatient = {
      name: expectedName,
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
})
