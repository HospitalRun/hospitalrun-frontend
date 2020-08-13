import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import PatientSearchRequest from '../../../patients/models/PatientSearchRequest'
import NoPatientsExist from '../../../patients/search/NoPatientsExist'
import ViewPatientsTable from '../../../patients/search/ViewPatientsTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Patients Table', () => {
  const setup = async (
    expectedSearchRequest: PatientSearchRequest,
    expectedPatients: Patient[],
  ) => {
    jest.spyOn(PatientRepository, 'search').mockResolvedValueOnce(expectedPatients)
    jest.spyOn(PatientRepository, 'count').mockResolvedValueOnce(expectedPatients.length)

    let wrapper: any
    const history = createMemoryHistory()

    await act(async () => {
      wrapper = await mount(
        <Router history={history}>
          <ViewPatientsTable searchRequest={expectedSearchRequest} />
        </Router>,
      )
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should search for patients given a search request', async () => {
    const expectedSearchRequest = { queryString: 'someQueryString' }
    await setup(expectedSearchRequest, [])

    expect(PatientRepository.search).toHaveBeenCalledTimes(1)
    expect(PatientRepository.search).toHaveBeenCalledWith(expectedSearchRequest.queryString)
  })

  it('should display no patients exist if total patient count is 0', async () => {
    const { wrapper } = await setup({ queryString: '' }, [])

    expect(wrapper.exists(NoPatientsExist)).toBeTruthy()
  })

  it('should render a table', async () => {
    const expectedPatient = {
      id: '123',
      givenName: 'givenName',
      familyName: 'familyName',
      sex: 'sex',
      dateOfBirth: new Date(2010, 1, 1, 1, 1, 1, 1).toISOString(),
    } as Patient
    const expectedPatients = [expectedPatient]
    const { wrapper } = await setup({ queryString: '' }, expectedPatients)

    const table = wrapper.find(Table)
    const columns = table.prop('columns')
    const actions = table.prop('actions') as any

    expect(table).toHaveLength(1)

    expect(columns[0]).toEqual(expect.objectContaining({ label: 'patient.code', key: 'code' }))
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'patient.givenName', key: 'givenName' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({ label: 'patient.familyName', key: 'familyName' }),
    )
    expect(columns[3]).toEqual(expect.objectContaining({ label: 'patient.sex', key: 'sex' }))
    expect(columns[4]).toEqual(
      expect.objectContaining({ label: 'patient.dateOfBirth', key: 'dateOfBirth' }),
    )

    expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
    expect(table.prop('data')).toEqual(expectedPatients)
    expect(table.prop('actionsHeaderText')).toEqual('actions.label')
  })
})
