import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme'
import RelatedPersonTab from 'patients/related-persons/RelatedPersonTab'
import * as components from '@hospitalrun/components'
import AddRelatedPersonModal from 'patients/related-persons/AddRelatedPersonModal'
import { act } from '@testing-library/react'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import Permissions from 'model/Permissions'
import RelatedPerson from 'model/RelatedPerson'
import { Button } from '@hospitalrun/components'
import * as patientSlice from '../../../patients/patient-slice'

const mockStore = configureMockStore([thunk])

describe('Related Persons Tab', () => {
  let wrapper: any
  let history = createMemoryHistory()

  describe('Add New Related Person', () => {
    let patient: any
    let user: any
    jest.spyOn(components, 'Toast')

    beforeEach(() => {
      jest.resetAllMocks()
      history = createMemoryHistory()

      patient = {
        id: '123',
        rev: '123',
      } as Patient

      jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)

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
      expect(newRelatedPersonButton.text().trim()).toEqual('patient.relatedPersons.add')
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
      const newRelatedPersonModal = wrapper.find(AddRelatedPersonModal)

      expect(newRelatedPersonModal.prop('show')).toBeFalsy()
      expect(newRelatedPersonModal).toHaveLength(1)
    })

    it('should show the New Related Person modal when the New Related Person button is clicked', () => {
      const newRelatedPersonButton = wrapper.find(components.Button)

      act(() => {
        const onClick = newRelatedPersonButton.prop('onClick') as any
        onClick()
      })

      wrapper.update()

      const newRelatedPersonModal = wrapper.find(AddRelatedPersonModal)
      expect(newRelatedPersonModal.prop('show')).toBeTruthy()
    })
  })

  describe('Table', () => {
    const patient = {
      id: '123',
      rev: '123',
      relatedPersons: [{ patientId: '123001', type: 'type' }],
    } as Patient
    const expectedRelatedPerson = {
      givenName: 'test',
      familyName: 'test',
      fullName: 'test test',
      id: '123001',
    } as Patient

    const user = {
      permissions: [Permissions.WritePatients, Permissions.ReadPatients],
    }

    beforeEach(async () => {
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedRelatedPerson)

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
      const table = wrapper.find('table')
      const tableHeader = wrapper.find('thead')
      const tableHeaders = wrapper.find('th')
      const tableBody = wrapper.find('tbody')
      const tableData = wrapper.find('td')
      const deleteButton = tableData.at(3).find(Button)
      expect(table).toHaveLength(1)
      expect(tableHeader).toHaveLength(1)
      expect(tableBody).toHaveLength(1)
      expect(tableHeaders.at(0).text()).toEqual('patient.givenName')
      expect(tableHeaders.at(1).text()).toEqual('patient.familyName')
      expect(tableHeaders.at(2).text()).toEqual('patient.relatedPersons.relationshipType')
      expect(tableHeaders.at(3).text()).toEqual('actions.label')
      expect(tableData.at(0).text()).toEqual(expectedRelatedPerson.givenName)
      expect(tableData.at(1).text()).toEqual(expectedRelatedPerson.familyName)
      expect(tableData.at(2).text()).toEqual((patient.relatedPersons as RelatedPerson[])[0].type)
      expect(deleteButton).toHaveLength(1)
      expect(deleteButton.text().trim()).toEqual('actions.delete')
      expect(deleteButton.prop('color')).toEqual('danger')
    })

    it('should remove the related person when the delete button is clicked', async () => {
      const removeRelatedPersonSpy = jest.spyOn(patientSlice, 'removeRelatedPerson')
      const eventPropagationSpy = jest.fn()

      const table = wrapper.find('table')
      const tableBody = table.find('tbody')
      const tableData = tableBody.find('td')
      const deleteButton = tableData.at(3).find(Button)

      await act(async () => {
        const onClick = deleteButton.prop('onClick')
        await onClick({ stopPropagation: eventPropagationSpy })
      })

      expect(removeRelatedPersonSpy).toHaveBeenCalledWith(patient.id, expectedRelatedPerson.id)
    })

    it('should navigate to related person patient profile on related person click', async () => {
      const table = wrapper.find('table')
      const tableBody = table.find('tbody')
      const row = tableBody.find('tr')
      await act(async () => {
        const onClick = row.prop('onClick')
        await onClick()
      })

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
      jest.spyOn(PatientRepository, 'find').mockResolvedValue({
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
