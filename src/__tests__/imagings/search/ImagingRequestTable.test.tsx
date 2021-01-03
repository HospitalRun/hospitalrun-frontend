import { render as rtlRender, screen } from '@testing-library/react'
import format from 'date-fns/format'
import React from 'react'

import ImagingSearchRequest from '../../../imagings/model/ImagingSearchRequest'
import ImagingRequestTable from '../../../imagings/search/ImagingRequestTable'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import Imaging from '../../../shared/model/Imaging'

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

  const render = (searchRequest: ImagingSearchRequest) => {
    jest.resetAllMocks()
    jest.spyOn(ImagingRepository, 'search').mockResolvedValue([expectedImaging])

    return rtlRender(<ImagingRequestTable searchRequest={searchRequest} />)
  }

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

    expect(cells[0]).toHaveTextContent(expectedImaging.code)
    expect(cells[1]).toHaveTextContent(expectedImaging.type)
    expect(cells[2]).toHaveTextContent(
      format(new Date(expectedImaging.requestedOn), 'yyyy-MM-dd hh:mm a'),
    )
    expect(cells[3]).toHaveTextContent(expectedImaging.fullName)
    expect(cells[4]).toHaveTextContent(expectedImaging.requestedBy)
    expect(cells[5]).toHaveTextContent(expectedImaging.status)
  })
})
