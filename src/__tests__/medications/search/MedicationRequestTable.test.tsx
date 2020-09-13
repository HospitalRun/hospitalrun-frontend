import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRequestTable from '../../../medications/search/MedicationRequestTable'
import MedicationRepository from '../../../shared/db/MedicationRepository'
import Medication from '../../../shared/model/Medication'

describe('Medication Request Table', () => {
  const setup = async (
    givenSearchRequest: MedicationSearchRequest = { text: '', status: 'all' },
    givenMedications: Medication[] = [],
  ) => {
    jest.resetAllMocks()
    jest.spyOn(MedicationRepository, 'search').mockResolvedValue(givenMedications)
    const history = createMemoryHistory()

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <MedicationRequestTable searchRequest={givenSearchRequest} />
        </Router>,
      )
    })
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render a table with the correct columns', async () => {
    const { wrapper } = await setup()

    const table = wrapper.find(Table)
    const columns = table.prop('columns')
    const actions = table.prop('actions') as any
    expect(columns[0]).toEqual(
      expect.objectContaining({ label: 'medications.medication.medication', key: 'medication' }),
    )
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'medications.medication.priority', key: 'priority' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({ label: 'medications.medication.intent', key: 'intent' }),
    )
    expect(columns[3]).toEqual(
      expect.objectContaining({
        label: 'medications.medication.requestedOn',
        key: 'requestedOn',
      }),
    )
    expect(columns[4]).toEqual(
      expect.objectContaining({ label: 'medications.medication.status', key: 'status' }),
    )

    expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    expect(table.prop('actionsHeaderText')).toEqual('actions.label')
  })

  it('should fetch medications and display it', async () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: 'someText', status: 'draft' }
    const expectedMedicationRequests: Medication[] = [{ id: 'someId' } as Medication]

    const { wrapper } = await setup(expectedSearchRequest, expectedMedicationRequests)

    const table = wrapper.find(Table)
    expect(MedicationRepository.search).toHaveBeenCalledWith(
      expect.objectContaining(expectedSearchRequest),
    )
    expect(table.prop('data')).toEqual(expectedMedicationRequests)
  })

  it('should navigate to the medication when the view button is clicked', async () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: 'someText', status: 'draft' }
    const expectedMedicationRequests: Medication[] = [{ id: 'someId' } as Medication]

    const { wrapper, history } = await setup(expectedSearchRequest, expectedMedicationRequests)

    const tr = wrapper.find('tr').at(1)
    act(() => {
      const onClick = tr.find('button').prop('onClick') as any
      onClick({ stopPropagation: jest.fn() })
    })

    expect(history.location.pathname).toEqual(`/medications/${expectedMedicationRequests[0].id}`)
  })
})
