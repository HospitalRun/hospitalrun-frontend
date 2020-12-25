import { screen, render, within } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import VisitTable from '../../../patients/visits/VisitTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Visit, { VisitStatus } from '../../../shared/model/Visit'

describe('Visit Table', () => {
  const visit: Visit = {
    id: 'id',
    startDateTime: new Date(2020, 6, 3).toISOString(),
    endDateTime: new Date(2020, 6, 5).toISOString(),
    type: 'standard type',
    status: VisitStatus.Arrived,
    reason: 'some reason',
    location: 'main building',
  } as Visit
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    visits: [visit],
  } as Patient

  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/visits/${patient.visits[0].id}`)

    return {
      history,
      ...render(
        <Router history={history}>
          <VisitTable patientId={patient.id} />
        </Router>,
      ),
    }
  }

  it('should render a table', async () => {
    setup()

    const visitTable = await screen.findByRole('table')

    expect(
      within(visitTable).getByRole('columnheader', { name: /patient.visits.startDateTime/i }),
    ).toBeInTheDocument()
    // const table = wrapper.find(Table)
    // const columns = table.prop('columns')
    // const actions = table.prop('actions') as any
    // expect(columns[0]).toEqual(
    //   expect.objectContaining({ label: 'patient.visits.startDateTime', key: 'startDateTime' }),
    // )
    // expect(columns[1]).toEqual(
    //   expect.objectContaining({ label: 'patient.visits.endDateTime', key: 'endDateTime' }),
    // )
    // expect(columns[2]).toEqual(
    //   expect.objectContaining({ label: 'patient.visits.type', key: 'type' }),
    // )
    // expect(columns[3]).toEqual(
    //   expect.objectContaining({ label: 'patient.visits.status', key: 'status' }),
    // )
    // expect(columns[4]).toEqual(
    //   expect.objectContaining({ label: 'patient.visits.reason', key: 'reason' }),
    // )
    // expect(columns[5]).toEqual(
    //   expect.objectContaining({ label: 'patient.visits.location', key: 'location' }),
    // )

    // expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    // expect(table.prop('actionsHeaderText')).toEqual('actions.label')
    // expect(table.prop('data')).toEqual(patient.visits)
  })

  it('should navigate to the visit view when the view details button is clicked', async () => {
    setup()

    // const tr = wrapper.find('tr').at(1)

    // act(() => {
    //   const onClick = tr.find('button').prop('onClick') as any
    //   onClick({ stopPropagation: jest.fn() })
    // })

    // expect(history.location.pathname).toEqual(`/patients/${patient.id}/visits/${visit.id}`)
  })
})
