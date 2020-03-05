import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme'
import RelatedPersonTab from 'patients/related-persons/RelatedPersonTab'
import * as components from '@hospitalrun/components'

import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import { act } from '@testing-library/react'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import Permissions from 'model/Permissions'
import { mocked } from 'ts-jest/utils'

import * as patientSlice from '../../../patients/patient-slice'

const mockStore = configureMockStore([thunk])

describe('Related Persons Tab', () => {
  let wrapper: any
  let history = createMemoryHistory()

  describe('Add New Related Person', () => {
    let patient: any
    let user: any
    jest.spyOn(components, 'Toast')
    let mockedComponents = mocked(components, true)

    beforeEach(() => {
      jest.resetAllMocks()
      mockedComponents = mocked(components, true)
      history = createMemoryHistory()

      patient = {
        id: '123',
        rev: '123',
      } as Patient

      user = {
        permissions: [Permissions.WritePatients, Permissions.ReadPatients],
      }
      act(() => {
        wrapper = mount(
          <Router history={history}>
            <Provider store={mockStore({ patient, user })}>
              <RelatedPersonTab patient={patient} />
            </Provider>
          </Router>,
        )
      })
    })

    it('should render a New Related Person button', () => {
      const newRelatedPersonButton = wrapper.find(components.Button)

      expect(newRelatedPersonButton).toHaveLength(1)
      expect(newRelatedPersonButton.text().trim()).toEqual('patient.relatedPersons.new')
    })

    it('should not render a New Related Person button if the user does not have write privileges for a patient', () => {
      user = { permissions: [Permissions.ReadPatients] }
      act(() => {
        wrapper = mount(
          <Router history={history}>
            <Provider store={mockStore({ patient, user })}>
              <RelatedPersonTab patient={patient} />
            </Provider>
          </Router>,
        )
      })
      const newRelatedPersonButton = wrapper.find(components.Button)
      expect(newRelatedPersonButton).toHaveLength(0)
    })

    it('should render a New Related Person modal', () => {
      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)

      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
      expect(newRelatedPersonModal).toHaveLength(1)
    })

    it('should show the New Related Person modal when the New Related Person button is clicked', () => {
      const newRelatedPersonButton = wrapper.find(components.Button)

      act(() => {
        ;(newRelatedPersonButton.prop('onClick') as any)()
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeTruthy()
    })

    it('should call update patient with the data from the modal', async () => {
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const store = mockStore({ patient, user })
      const expectedRelatedPerson = { patientId: '123', type: 'type' }
      const expectedPatient = {
        ...patient,
        relatedPersons: [expectedRelatedPerson],
      }
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.saveOrUpdate.mockResolvedValue(expectedPatient)

      act(() => {
        wrapper = mount(
          <Router history={history}>
            <Provider store={store}>
              <RelatedPersonTab patient={patient} />
            </Provider>
          </Router>,
        )
      })
      act(() => {
        const newRelatedPersonButton = wrapper.find(components.Button)
        const onClick = newRelatedPersonButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      await act(async () => {
        const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
        const onSave = newRelatedPersonModal.prop('onSave') as any
        onSave(expectedRelatedPerson)
      })
      wrapper.update()

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
      expect(store.getActions()).toContainEqual(patientSlice.updatePatientStart())
      expect(store.getActions()).toContainEqual(patientSlice.updatePatientSuccess(expectedPatient))
    })

    it('should close the modal when the save button is clicked', () => {
      act(() => {
        const newRelatedPersonButton = wrapper.find(components.Button)
        const onClick = newRelatedPersonButton.prop('onClick') as any
        onClick()
      })

      wrapper.update()

      act(() => {
        const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
        const onSave = newRelatedPersonModal.prop('onSave') as any
        onSave({ patientId: '123', type: 'type' })
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
    })

    it('should display a success message when the new related person is added', async () => {
      await act(async () => {
        const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
        const onSave = newRelatedPersonModal.prop('onSave') as any
        await onSave({ patientId: 'testMessage', type: 'type' })
      })
      wrapper.update()

      expect(mockedComponents.Toast).toHaveBeenCalledWith(
        'success',
        'Success!',
        'patient.relatedPersons.successfullyAdded',
      )
    })
  })

  describe('List', () => {
    const patient = {
      id: '123',
      rev: '123',
      relatedPersons: [{ patientId: '123', type: 'type' }],
    } as Patient

    const user = {
      permissions: [Permissions.WritePatients, Permissions.ReadPatients],
    }

    beforeEach(async () => {
      jest.spyOn(PatientRepository, 'find')
      mocked(PatientRepository.find).mockResolvedValue({
        fullName: 'test test',
        id: '123001',
      } as Patient)

      await act(async () => {
        wrapper = await mount(
          <Router history={history}>
            <Provider store={mockStore({ patient, user })}>
              <RelatedPersonTab patient={patient} />
            </Provider>
          </Router>,
        )
      })
      wrapper.update()
    })

    it('should render a list of related persons with their full name being displayed', () => {
      const list = wrapper.find(components.List)
      const listItems = wrapper.find(components.ListItem)
      expect(list).toHaveLength(1)
      expect(listItems).toHaveLength(1)
      expect(listItems.at(0).text()).toEqual('test test')
    })
    it('should navigate to related person patient profile on related person click', () => {
      const list = wrapper.find(components.List)
      const listItems = wrapper.find(components.ListItem)
      act(() => {
        ;(listItems.at(0).prop('onClick') as any)()
      })
      expect(list).toHaveLength(1)
      expect(listItems).toHaveLength(1)
      expect(history.location.pathname).toEqual('/patients/123001')
    })
  })

  describe('EmptyList', () => {
    const patient = {
      id: '123',
      rev: '123',
    } as Patient

    const user = {
      permissions: [Permissions.WritePatients, Permissions.ReadPatients],
    }

    beforeEach(async () => {
      jest.spyOn(PatientRepository, 'find')
      mocked(PatientRepository.find).mockResolvedValue({
        fullName: 'test test',
        id: '123001',
      } as Patient)

      await act(async () => {
        wrapper = await mount(
          <Router history={history}>
            <Provider store={mockStore({ patient, user })}>
              <RelatedPersonTab patient={patient} />
            </Provider>
          </Router>,
        )
      })
      wrapper.update()
    })

    it('should display a warning if patient has no related persons', () => {
      const warning = wrapper.find(components.Alert)
      expect(warning).toBeDefined()
    })
  })
})
