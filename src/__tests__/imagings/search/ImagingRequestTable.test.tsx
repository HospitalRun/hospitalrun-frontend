import { Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ImagingSearchRequest from '../../../imagings/model/ImagingSearchRequest'
import ImagingRequestTable from '../../../imagings/search/ImagingRequestTable'
import ViewImagings from '../../../imagings/search/ViewImagings'
import * as titleUtil from '../../../page-header/title/TitleContext'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import ImagingRepository from '../../../shared/db/ImagingRepository'
import SortRequest from '../../../shared/db/SortRequest'
import Imaging from '../../../shared/model/Imaging'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const defaultSortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

const mockStore = createMockStore<RootState, any>([thunk])

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

describe('View Imagings Search', () => {
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

  const setup = async (permissions: Permissions[] = []) => {
    jest.resetAllMocks()
    jest.spyOn(ImagingRepository, 'search').mockResolvedValue(expectedImagings)

    const history = createMemoryHistory()
    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <TitleProvider>
              <ViewImagings />
            </TitleProvider>
          </Router>
        </Provider>,
      )
    })
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('Should render imaging filter field', async () => {
    const { wrapper } = await setup()
    expect(wrapper.find(SelectWithLabelFormGroup)).toHaveLength(1)
  })

  it('Should render imaging search text field', async () => {
    const { wrapper } = await setup()
    expect(wrapper.find(TextInputWithLabelFormGroup)).toHaveLength(1)
  })
})
