import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Route, Router } from 'react-router-dom'

import ViewVisit from '../../../patients/visits/ViewVisit'
import VisitForm from '../../../patients/visits/VisitForm'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Visit', () => {
  const patient = {
    id: 'patientId',
    visits: [{ id: '123', reason: 'reason for visit' }],
  } as Patient

  const setup = async () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/visits/${patient.visits[0].id}`)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <Route path="/patients/:id/visits/:visitId">
            <ViewVisit patientId={patient.id} />
          </Route>
        </Router>,
      )
    })

    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render the visit reason', async () => {
    const { wrapper } = await setup()

    expect(wrapper.find('h2').text()).toEqual(patient.visits[0].reason)
  })

  it('should render a visit form with the correct data', async () => {
    const { wrapper } = await setup()

    const visitForm = wrapper.find(VisitForm)
    expect(visitForm).toHaveLength(1)
    expect(visitForm.prop('visit')).toEqual(patient.visits[0])
  })
})
