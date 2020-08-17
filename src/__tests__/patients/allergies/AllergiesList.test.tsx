import { Alert, List, ListItem } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import AllergiesList from '../../../patients/allergies/AllergiesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Allergy from '../../../shared/model/Allergy'
import Patient from '../../../shared/model/Patient'

describe('Allergies list', () => {
  const setup = async (allergies: Allergy[]) => {
    const mockPatient = { id: '123', allergies } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${mockPatient.id}/allergies`)
    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <AllergiesList patientId={mockPatient.id} />
        </Router>,
      )
    })

    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a list of allergies', async () => {
    const expectedAllergies = [{ id: '456', name: 'some name' }]
    const { wrapper } = await setup(expectedAllergies)
    const listItems = wrapper.find(ListItem)

    expect(wrapper.exists(List)).toBeTruthy()
    expect(listItems).toHaveLength(expectedAllergies.length)
    expect(listItems.at(0).text()).toEqual(expectedAllergies[0].name)
  })

  it('should display a warning when no allergies are present', async () => {
    const expectedAllergies: Allergy[] = []
    const { wrapper } = await setup(expectedAllergies)

    const alert = wrapper.find(Alert)

    expect(wrapper.exists(Alert)).toBeTruthy()
    expect(wrapper.exists(List)).toBeFalsy()

    expect(alert.prop('color')).toEqual('warning')
    expect(alert.prop('title')).toEqual('patient.allergies.warning.noAllergies')
    expect(alert.prop('message')).toEqual('patient.allergies.addAllergyAbove')
  })

  it('should navigate to the allergy view when the allergy is clicked', async () => {
    const expectedAllergies = [{ id: '456', name: 'some name' }]
    const { wrapper, history } = await setup(expectedAllergies)
    const item = wrapper.find(ListItem)
    act(() => {
      const onClick = item.prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/patients/123/allergies/${expectedAllergies[0].id}`)
  })
})
