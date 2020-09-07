import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import CarePlanForm from '../../../patients/care-plans/CarePlanForm'
import ViewCarePlan from '../../../patients/care-plans/ViewCarePlan'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Care Plan', () => {
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    carePlans: [{ id: '123', title: 'some title' }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/care-plans/${patient.carePlans[0].id}`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/care-plans/:carePlanId">
            <ViewCarePlan />
          </Route>
        </Router>,
      )
    })
    wrapper.update()

    return { wrapper }
  }

  it('should render the care plan title', async () => {
    const { wrapper } = await setup()

    expect(wrapper.find('h2').text()).toEqual(patient.carePlans[0].title)
  })

  it('should render a care plan form with the correct data', async () => {
    const { wrapper } = await setup()

    const carePlanForm = wrapper.find(CarePlanForm)
    expect(carePlanForm).toHaveLength(1)
    expect(carePlanForm.prop('carePlan')).toEqual(patient.carePlans[0])
    expect(carePlanForm.prop('patient')).toEqual(patient)
  })
})
