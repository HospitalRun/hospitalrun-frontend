import { Alert, Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import DiagnosisTable from '../../../patients/diagnoses/DiagnosisTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

describe('Diagnosis Table', () => {
  const diagnosis: Diagnosis = {
    id: '456',
    name: 'diagnosis name',
    diagnosisDate: new Date(2020, 12, 2).toISOString(),
    onsetDate: new Date(2020, 12, 3).toISOString(),
    abatementDate: new Date(2020, 12, 4).toISOString(),
    status: DiagnosisStatus.Active,
    note: 'note',
    visit: 'visit',
  }
  const patient = {
    id: '123',
    diagnoses: [diagnosis],
  } as Patient

  const setup = async (expectedPatient = patient) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    const history = createMemoryHistory()
    history.push(`/patients/${patient.id}/diagnoses/${diagnosis.id}`)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <DiagnosisTable patientId={expectedPatient.id} />
        </Router>,
      )
    })
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a table', async () => {
    const { wrapper } = await setup()

    const table = wrapper.find(Table)
    const columns = table.prop('columns')
    const actions = table.prop('actions') as any
    expect(columns[0]).toEqual(
      expect.objectContaining({ label: 'patient.diagnoses.diagnosisName', key: 'name' }),
    )
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'patient.diagnoses.diagnosisDate', key: 'diagnosisDate' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({ label: 'patient.diagnoses.onsetDate', key: 'onsetDate' }),
    )
    expect(columns[3]).toEqual(
      expect.objectContaining({ label: 'patient.diagnoses.abatementDate', key: 'abatementDate' }),
    )
    expect(columns[4]).toEqual(
      expect.objectContaining({ label: 'patient.diagnoses.status', key: 'status' }),
    )

    expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    expect(table.prop('actionsHeaderText')).toEqual('actions.label')
    expect(table.prop('data')).toEqual(patient.diagnoses)
  })

  it('should navigate to the diagnosis view when the view details button is clicked', async () => {
    const { wrapper, history } = await setup()

    const tr = wrapper.find('tr').at(1)

    act(() => {
      const onClick = tr.find('button').prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/patients/${patient.id}/diagnoses/${diagnosis.id}`)
  })

  it('should display a warning if there are no diagnoses', async () => {
    const { wrapper } = await setup({ ...patient, diagnoses: [] })

    expect(wrapper.exists(Alert)).toBeTruthy()
    const alert = wrapper.find(Alert)
    expect(alert.prop('color')).toEqual('warning')
    expect(alert.prop('title')).toEqual('patient.diagnoses.warning.noDiagnoses')
    expect(alert.prop('message')).toEqual('patient.diagnoses.addDiagnosisAbove')
  })
})
