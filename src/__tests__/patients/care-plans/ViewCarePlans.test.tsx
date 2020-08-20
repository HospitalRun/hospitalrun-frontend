import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import CarePlanTable from '../../../patients/care-plans/CarePlanTable'
import ViewCarePlans from '../../../patients/care-plans/ViewCarePlans'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'

describe('View Care Plans', () => {
  const patient = { id: '123', carePlans: [] as CarePlan[] } as Patient
  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/careplans`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/careplans">
            <ViewCarePlans />
          </Route>
        </Router>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render a care plans table with the patient id', async () => {
    const { wrapper } = await setup()

    expect(wrapper.exists(CarePlanTable)).toBeTruthy()
    const carePlanTable = wrapper.find(CarePlanTable)
    expect(carePlanTable.prop('patientId')).toEqual(patient.id)
  })
})
