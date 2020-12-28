import { render as rtlRender, screen } from '@testing-library/react'
import React from 'react'

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

  const render = (searchRequest: ImagingSearchRequest) => {
    jest.resetAllMocks()
    jest.spyOn(ImagingRepository, 'search').mockResolvedValue(expectedImagings)

    const results = rtlRender(<ImagingRequestTable searchRequest={searchRequest} />)

    return results
  }

  it('should search for imaging requests ', () => {
    const expectedSearch: ImagingSearchRequest = { status: 'all', text: 'text' }
    render(expectedSearch)

    expect(ImagingRepository.search).toHaveBeenCalledTimes(1)
    expect(ImagingRepository.search).toHaveBeenCalledWith({ ...expectedSearch, defaultSortRequest })
  })

  it('should render a table of imaging requests', async () => {
    const expectedSearch: ImagingSearchRequest = { status: 'all', text: 'text' }
    render(expectedSearch)

    const headers = await screen.findAllByRole('columnheader')
    const cells = screen.getAllByRole('cell')
    expect(headers[0]).toHaveTextContent(/imagings.imaging.code/i)
    expect(headers[1]).toHaveTextContent(/imagings.imaging.type/i)
    expect(headers[2]).toHaveTextContent(/imagings.imaging.requestedOn/i)
    expect(headers[3]).toHaveTextContent(/imagings.imaging.patient/i)
    expect(headers[4]).toHaveTextContent(/imagings.imaging.requestedBy/i)
    expect(headers[5]).toHaveTextContent(/imagings.imaging.status/i)

    expect(cells[0]).toHaveTextContent('I-1234')
    expect(cells[1]).toHaveTextContent('imaging type')
    expect(cells[3]).toHaveTextContent('full name')
    expect(cells[4]).toHaveTextContent('some user')
    expect(cells[5]).toHaveTextContent('requested')
  })
})
