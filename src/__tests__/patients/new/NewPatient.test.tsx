import '../../../__mocks__/matchMediaMock'

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

import PatientRepository from '../../../clients/db/PatientRepository'
import Patient from '../../../model/Patient'
import * as titleUtil from '../../../page-header/useTitle'
import GeneralInformation from '../../../patients/GeneralInformation'
import NewPatient from '../../../patients/new/NewPatient'
import * as patientSlice from '../../../patients/patient-slice'
import { RootState } from '../../../store'

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

  const arrayIndex = 0
  const expectedPhoneNumber = 'expectedPhoneNumber'
  const expectedEmail = 'expectedEmail'
  const expectedAddress = 'expectedAddress'
  const phoneNumbers = [
    {
      id: '1234',
      phoneNumber: 'phoneNumber',
      type: 'Home',
    },
  ]
  const emails = [
    {
      id: '1234',
      email: 'email@email.com',
      type: 'Home',
    },
  ]
  const addresses = [
    {
      id: '1234',
      address: 'address',
      type: 'Home',
    },
  ]

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
    const saveButton = wrapper.find(components.Button).at(3)
    const onClick = saveButton.prop('onClick') as any

    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(PatientRepository.save).toHaveBeenCalledWith(patient)
    expect(store.getActions()).toContainEqual(patientSlice.createPatientStart())
    expect(store.getActions()).toContainEqual(patientSlice.createPatientSuccess())
  })

  it('Add Buttons for Phone Numbers, Emails and Adresses', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()
    const addPhoneNumberButton = wrapper.find(components.Button).at(0)
    expect(addPhoneNumberButton.text().trim()).toEqual('patient.phoneNumber.addPhoneNumber')
    expect(addPhoneNumberButton).toHaveLength(1)

    const addEmailButton = wrapper.find(components.Button).at(1)
    expect(addEmailButton.text().trim()).toEqual('patient.email.addEmail')
    expect(addEmailButton).toHaveLength(1)

    const addAddressButton = wrapper.find(components.Button).at(2)
    expect(addAddressButton.text().trim()).toEqual('patient.address.addAddress')
    expect(addAddressButton).toHaveLength(1)
  })

  it('should update the phoneNumbers when the onChange Event is triggered for phoneNumber', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })
    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedPhoneNumber,
        'phoneNumbers',
        false,
        phoneNumbers,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedPhoneNumber,
        'phoneNumbers',
        'type',
        phoneNumbers,
      )
    })
  })

  it('should update the emails when the onChange Event is triggered for email', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedEmail,
        'emails',
        false,
        emails,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedEmail,
        'emails',
        'type',
        emails,
      )
    })
  })

  it('should update the addresses when the onChange Event is triggered for address', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        false,
        addresses,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        'type',
        addresses,
      )
    })
  })

  it('should update the addresses when the onChange Event is triggered for Address', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        false,
        addresses,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        'type',
        addresses,
      )
    })
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

    const saveButton = wrapper.find(components.Button).at(3)
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

    const cancelButton = wrapper.find(components.Button).at(4)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    expect(history.location.pathname).toEqual('/patients')
  })
})
