import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import ViewAllergy from '../../../patients/allergies/ViewAllergy'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Care Plan', () => {
  const patient = {
    id: 'patientId',
    allergies: [{ id: '123', name: 'some name' }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/allergies/${patient.allergies![0].id}`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/allergies/:allergyId">
            <ViewAllergy />
          </Route>
        </Router>,
      )
    })

    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render a allergy input with the correct data', async () => {
    const { wrapper } = await setup()

    const allergyName = wrapper.find(TextInputWithLabelFormGroup)
    expect(allergyName).toHaveLength(1)
    expect(allergyName.prop('value')).toEqual(patient.allergies![0].name)
  })
})
