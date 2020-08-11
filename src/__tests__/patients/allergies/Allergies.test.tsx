import * as components from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Allergies from '../../../patients/allergies/Allergies'
import AllergiesList from '../../../patients/allergies/AllergiesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])
const history = createMemoryHistory()
const expectedPatient = {
  id: '123',
  rev: '123',
  allergies: [
    { id: '1', name: 'allergy1' },
    { id: '2', name: 'allergy2' },
  ],
} as Patient

let store: any

const setup = async (
  patient = expectedPatient,
  permissions = [Permissions.AddAllergy],
  route = '/patients/123/allergies',
) => {
  store = mockStore({ patient: { patient }, user: { permissions } } as any)
  history.push(route)

  let wrapper: any
  await act(async () => {
    wrapper = await mount(
      <Router history={history}>
        <Provider store={store}>
          <Allergies patient={patient} />
        </Provider>
      </Router>,
    )
  })

  return wrapper
}

describe('Allergies', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  describe('add new allergy button', () => {
    it('should render a button to add new allergies', async () => {
      const wrapper = await setup()

      const addAllergyButton = wrapper.find(components.Button)
      expect(addAllergyButton).toHaveLength(1)
      expect(addAllergyButton.text().trim()).toEqual('patient.allergies.new')
    })

    it('should not render a button to add new allergies if the user does not have permissions', async () => {
      const wrapper = await setup(expectedPatient, [])

      const addAllergyButton = wrapper.find(components.Button)
      expect(addAllergyButton).toHaveLength(0)
    })

    it('should open the New Allergy Modal when clicked', async () => {
      const wrapper = await setup()

      act(() => {
        const addAllergyButton = wrapper.find(components.Button)
        const onClick = addAllergyButton.prop('onClick') as any
        onClick({} as React.MouseEvent<HTMLButtonElement>)
      })

      wrapper.update()

      expect(wrapper.find(components.Modal).prop('show')).toBeTruthy()
    })
  })

  describe('allergy list', () => {
    it('should render allergies', async () => {
      const wrapper = await setup()

      expect(wrapper.exists(AllergiesList)).toBeTruthy()
    })
  })
})
