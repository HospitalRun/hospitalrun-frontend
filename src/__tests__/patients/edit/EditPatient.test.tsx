import subDays from 'date-fns/subDays'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as titleUtil from '../../../page-header/title/TitleContext'
import EditPatient from '../../../patients/edit/EditPatient'
import GeneralInformation from '../../../patients/GeneralInformation'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

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
    phoneNumbers: [{ value: '123456789', id: '789' }],
    emails: [{ value: 'email@email.com', id: '456' }],
    addresses: [{ value: 'address', id: '123' }],
    code: 'P00001',
    dateOfBirth: subDays(new Date(), 2).toISOString(),
    index: 'givenName familyName suffixP00001',
  } as Patient

  let history: any
  let store: MockStore

  const setup = () => {
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    history = createMemoryHistory()
    store = mockStore({ patient: { patient } } as any)

    history.push('/patients/edit/123')
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/patients/edit/:id">
            <titleUtil.TitleProvider>
              <EditPatient />
            </titleUtil.TitleProvider>
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.find(EditPatient).props().updateTitle = jest.fn()

    wrapper.update()

    return wrapper
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should have called the useUpdateTitle hook', async () => {
    await act(async () => {
      await setup()
    })
    expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
  })

  it('should render an edit patient form', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    expect(wrapper.find(GeneralInformation)).toHaveLength(1)
  })

  it('should load a Patient when component loads', async () => {
    await act(async () => {
      await setup()
    })

    expect(PatientRepository.find).toHaveBeenCalledWith(patient.id)
  })

  it('should dispatch updatePatient when save button is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const saveButton = wrapper.find('.btn-save').at(0)
    const onClick = saveButton.prop('onClick') as any
    expect(saveButton.text().trim()).toEqual('actions.save')

    await act(async () => {
      await onClick()
    })

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(patient)
  })

  it('should navigate to /patients/:id when cancel is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup()
    })

    wrapper.update()

    const cancelButton = wrapper.find('.btn-cancel').at(1)
    const onClick = cancelButton.prop('onClick') as any
    expect(cancelButton.text().trim()).toEqual('actions.cancel')

    act(() => {
      onClick()
    })

    wrapper.update()
    expect(history.location.pathname).toEqual('/patients/123')
  })
})
