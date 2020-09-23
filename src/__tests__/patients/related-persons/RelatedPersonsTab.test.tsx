import * as components from '@hospitalrun/components'
import { Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AddRelatedPersonModal from '../../../patients/related-persons/AddRelatedPersonModal'
import RelatedPersonTab from '../../../patients/related-persons/RelatedPersonTab'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

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
      jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue([])

      user = {
        permissions: [Permissions.WritePatients, Permissions.ReadPatients],
      }
      act(() => {
        wrapper = mount(
          <Router history={history}>
            <Provider store={mockStore({ patient, user } as any)}>
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
            <Provider store={mockStore({ patient, user } as any)}>
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
      type: 'type',
    } as Patient

    const user = {
      permissions: [Permissions.WritePatients, Permissions.ReadPatients],
    }

    beforeEach(async () => {
      jest.spyOn(PatientRepository, 'saveOrUpdate')
      jest
        .spyOn(PatientRepository, 'find')
        .mockResolvedValueOnce(patient)
        .mockResolvedValueOnce(expectedRelatedPerson)

      await act(async () => {
        wrapper = await mount(
          <Router history={history}>
            <Provider store={mockStore({ patient, user } as any)}>
              <RelatedPersonTab patient={patient} />
            </Provider>
          </Router>,
        )
      })
      wrapper.update()
    })

    it('should render a list of related persons with their full name being displayed', () => {
      const table = wrapper.find(Table)
      const columns = table.prop('columns')
      const actions = table.prop('actions') as any
      expect(columns[0]).toEqual(
        expect.objectContaining({ label: 'patient.givenName', key: 'givenName' }),
      )
      expect(columns[1]).toEqual(
        expect.objectContaining({ label: 'patient.familyName', key: 'familyName' }),
      )
      expect(columns[2]).toEqual(
        expect.objectContaining({
          label: 'patient.relatedPersons.relationshipType',
          key: 'type',
        }),
      )

      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(actions[1]).toEqual(expect.objectContaining({ label: 'actions.delete' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual([expectedRelatedPerson])
    })

    it('should remove the related person when the delete button is clicked', async () => {
      const removeRelatedPersonSpy = jest.spyOn(PatientRepository, 'saveOrUpdate')
      const tr = wrapper.find('tr').at(1)

      await act(async () => {
        const onClick = tr.find('button').at(1).prop('onClick') as any
        await onClick({ stopPropagation: jest.fn() })
      })
      expect(removeRelatedPersonSpy).toHaveBeenCalledWith({ ...patient, relatedPersons: [] })
    })

    it('should navigate to related person patient profile on related person click', async () => {
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').at(0).prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
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
            <Provider store={mockStore({ patient, user } as any)}>
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
