import '../../../__mocks__/matchMediaMock'

import { Button } from '@hospitalrun/components'
import { subDays } from 'date-fns'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from '../../../clients/db/PatientRepository'
import Patient from '../../../model/Patient'
import * as titleUtil from '../../../page-header/useTitle'
import EditPatient from '../../../patients/edit/EditPatient'
import GeneralInformation from '../../../patients/GeneralInformation'
import * as patientSlice from '../../../patients/patient-slice'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

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
    phoneNumbers: [
      {
        id: '1234',
        phoneNumber: 'phoneNumber',
        type: 'Home',
      },
    ],
    emails: [
      {
        id: '1234',
        email: 'email@email.com',
        type: 'Home',
      },
    ],
    addresses: [
      {
        id: '1234',
        address: 'address',
        type: 'Home',
      },
    ],
    code: 'P00001',
    dateOfBirth: subDays(new Date(), 2).toISOString(),
  } as Patient

  let history: any
  let store: MockStore

  const setup = () => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient } } as any)

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

  const arrayIndex = 0
  const expectedPhoneNumber = 'expectedPhoneNumber'
  const expectedEmail = 'expectedEmail'
  const expectedAddress = 'expectedAddress'

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

  it('should update the phoneNumbers when the onChange Event is triggered for phoneNumber', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })
    wrapper.update()

    const generalInformationForm = wrapper.find(GeneralInformation)

    act(() => {
      generalInformationForm.prop('onObjectArrayChange')(
        arrayIndex,
        expectedPhoneNumber,
        'phoneNumbers',
        false,
      )
      generalInformationForm.prop('onObjectArrayChange')(
        arrayIndex,
        expectedPhoneNumber,
        'phoneNumbers',
        'type',
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedPhoneNumber,
        'phoneNumbers',
        false,
        patient.phoneNumbers,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedPhoneNumber,
        'phoneNumbers',
        'type',
        patient.phoneNumbers,
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
      generalInformationForm.prop('onObjectArrayChange')(
        arrayIndex,
        expectedEmail,
        'addresses',
        false,
      )
      generalInformationForm.prop('onObjectArrayChange')(
        arrayIndex,
        expectedEmail,
        'addresses',
        'type',
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedEmail,
        'addresses',
        false,
        patient.emails,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedEmail,
        'addresses',
        'type',
        patient.emails,
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
      generalInformationForm.prop('onObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        false,
      )
      generalInformationForm.prop('onObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        'type',
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        false,
        patient.addresses,
      )
      generalInformationForm.prop('onTempObjectArrayChange')(
        arrayIndex,
        expectedAddress,
        'addresses',
        'type',
        patient.addresses,
      )
    })
  })

  it('should dispatch updatePatient when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find(Button).at(3)

    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(store.getActions()).toContainEqual(patientSlice.updatePatientStart())
  })

  it('Disabled Button for Phone Numbers', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()
    const disabledPhoneNumberButton = wrapper.find(Button).at(0)
    expect(disabledPhoneNumberButton.text().trim()).toEqual(
      'patient.phoneNumber.disabledPhoneNumber',
    )
    expect(disabledPhoneNumberButton).toHaveLength(1)
  })

  it('Add Buttons for Emails and Adresses', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const addEmailButton = wrapper.find(Button).at(1)
    expect(addEmailButton.text().trim()).toEqual('patient.email.addEmail')
    expect(addEmailButton).toHaveLength(1)

    const addAddressButton = wrapper.find(Button).at(2)
    expect(addAddressButton.text().trim()).toEqual('patient.address.addAddress')
    expect(addAddressButton).toHaveLength(1)
  })

  it('should navigate to /patients/:id when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const cancelButton = wrapper.find(Button).at(4)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    wrapper.update()
    expect(history.location.pathname).toEqual('/patients/123')
  })
})
