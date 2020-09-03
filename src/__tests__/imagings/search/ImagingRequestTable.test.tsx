import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import ImagingSearchRequest from '../../../imagings/model/ImagingSearchRequest'
import ImagingRequestTable from '../../../imagings/search/ImagingRequestTable'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import SortRequest from '../../../shared/db/SortRequest'
import Imaging from '../../../shared/model/Imaging'

const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

describe('Imaging Request Table', () => {
  const expectedImaging = {
    code: 'I-1234',
    id: '1234',
    type: 'imaging type',
    patient: 'patient',
    fullName: 'full name',
    status: 'requested',
    requestedOn: new Date().toISOString(),
    requestedBy: 'some user',
  } as Imaging
  const expectedImagings = [expectedImaging]

  const setup = async (searchRequest: ImagingSearchRequest) => {
    jest.resetAllMocks()
    jest.spyOn(ImagingRepository, 'search').mockResolvedValue(expectedImagings)
    let wrapper: any

    await act(async () => {
      wrapper = await mount(<ImagingRequestTable searchRequest={searchRequest} />)
    })
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should search for imaging requests ', async () => {
    const expectedSearch: ImagingSearchRequest = { status: 'all', text: 'text' }
    await setup(expectedSearch)

    expect(ImagingRepository.search).toHaveBeenCalledTimes(1)
    expect(ImagingRepository.search).toHaveBeenCalledWith({ ...expectedSearch, defaultSortRequest })
  })

  it('should render a table of imaging requests', async () => {
    const expectedSearch: ImagingSearchRequest = { status: 'all', text: 'text' }
    const { wrapper } = await setup(expectedSearch)

    const table = wrapper.find(Table)
    const columns = table.prop('columns')
    expect(columns[0]).toEqual(
      expect.objectContaining({ label: 'imagings.imaging.code', key: 'code' }),
    )
    expect(columns[1]).toEqual(
      expect.objectContaining({ label: 'imagings.imaging.type', key: 'type' }),
    )
    expect(columns[2]).toEqual(
      expect.objectContaining({ label: 'imagings.imaging.requestedOn', key: 'requestedOn' }),
    )
    expect(columns[3]).toEqual(
      expect.objectContaining({ label: 'imagings.imaging.patient', key: 'fullName' }),
    )
    expect(columns[4]).toEqual(
      expect.objectContaining({ label: 'imagings.imaging.requestedBy', key: 'requestedBy' }),
    )
    expect(columns[5]).toEqual(
      expect.objectContaining({ label: 'imagings.imaging.status', key: 'status' }),
    )

    expect(table.prop('data')).toEqual([expectedImaging])
  })
})
