import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import RelatedPersonTab from 'patients/related-persons/RelatedPersonTab'
import { Button, List, ListItem } from '@hospitalrun/components'
import NewRelatedPersonModal from 'patients/related-persons/NewRelatedPersonModal'
import { act } from '@testing-library/react'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import * as patientSlice from '../../../patients/patient-slice'

const mockStore = createMockStore([thunk])

describe('Related Persons Tab', () => {
  let wrapper: ReactWrapper

  describe('Add New Related Person', () => {
    const patient = {
      id: '123',
      rev: '123',
    } as Patient

    beforeEach(() => {
      wrapper = mount(
        <Provider store={mockStore({ patient })}>
          <RelatedPersonTab patient={patient} />
        </Provider>,
      )
    })

    it('should render a New Related Person button', () => {
      const newRelatedPersonButton = wrapper.find(Button)

      expect(newRelatedPersonButton).toHaveLength(1)
      expect(newRelatedPersonButton.text().trim()).toEqual('patient.relatedPersons.new')
    })

    it('should render a New Related Person modal', () => {
      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)

      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
      expect(newRelatedPersonModal).toHaveLength(1)
    })

    it('should show the New Related Person modal when the New Related Person button is clicked', () => {
      const newRelatedPersonButton = wrapper.find(Button)

      act(() => {
        ;(newRelatedPersonButton.prop('onClick') as any)()
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeTruthy()
    })

    it('should call update patient with the data from the modal', () => {
      jest.spyOn(patientSlice, 'updatePatient')
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      const expectedRelatedPerson = { givenName: 'test', fullName: 'test' }
      const expectedPatient = {
        ...patient,
        relatedPersons: [expectedRelatedPerson],
      }

      act(() => {
        const newRelatedPersonButton = wrapper.find(Button)
        const onClick = newRelatedPersonButton.prop('onClick') as any
        onClick()
      })

      wrapper.update()

      act(() => {
        const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)

        const onSave = newRelatedPersonModal.prop('onSave') as any
        onSave({ givenName: 'test' })
      })

      wrapper.update()

      expect(patientSlice.updatePatient).toHaveBeenCalledTimes(1)
      expect(patientSlice.updatePatient).toHaveBeenCalledWith(expectedPatient)
    })

    it('should close the modal when the save button is clicked', () => {
      act(() => {
        const newRelatedPersonButton = wrapper.find(Button)
        const onClick = newRelatedPersonButton.prop('onClick') as any
        onClick()
      })

      wrapper.update()

      act(() => {
        const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
        const onSave = newRelatedPersonModal.prop('onSave') as any
        onSave({ givenName: 'test' })
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(NewRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
    })
  })

  describe('List', () => {
    const patient = {
      id: '123',
      rev: '123',
      relatedPersons: [{ fullName: 'test' }],
    } as Patient

    beforeEach(() => {
      wrapper = mount(
        <Provider store={mockStore({ patient })}>
          <RelatedPersonTab patient={patient} />
        </Provider>,
      )
    })

    it('should render a list of of related persons with their full name being displayed', () => {
      const list = wrapper.find(List)
      const listItems = wrapper.find(ListItem)

      expect(list).toHaveLength(1)
      expect(listItems).toHaveLength(1)
      expect(listItems.at(0).text()).toEqual(patient.relatedPersons[0].fullName)
    })
  })
})
