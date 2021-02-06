import { Button, Tab, TabsHeader, Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import ViewIncidentDetails from '../../../incidents/view/ViewIncidentDetails'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Note from '../../../shared/model/Note'
import Permissions from '../../../shared/model/Permissions'
import NewNoteModal from '../../../shared/notes/NewNoteModal'
import { RootState } from '../../../shared/store'
import * as uuid from '../../../shared/util/uuid'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('View Incident', () => {
  let incidentRepositorySaveSpy: any
  const queryCache = new QueryCache()
  const expectedResolveDate = new Date()
  const mockedIncident: Incident = {
    id: '1234',
    code: 'some code',
    department: 'some department',
    description: 'some description',
    category: 'some category',
    categoryItem: 'some category item',
    status: 'reported',
    reportedBy: 'some user id',
    reportedOn: new Date().toISOString(),
    date: new Date().toISOString(),
    notes: [
      {
        id: '2345',
        date: 'some date',
        text: 'some note text',
        givenBy: 'given by text',
      } as Note,
    ],
  } as Incident

  const setup = async (permissions: Permissions[], incident: Incident) => {
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedResolveDate.valueOf())
    jest.spyOn(uuid, 'uuid').mockReturnValue('7777')
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
    jest.spyOn(breadcrumbUtil, 'default')
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(incident)
    const history = createMemoryHistory()
    history.push(`/incidents/1234`)
    incidentRepositorySaveSpy = jest
      .spyOn(IncidentRepository, 'saveOrUpdate')
      .mockResolvedValue(mockedIncident)

    const store = mockStore({
      user: {
        permissions,
        user: {
          id: '8542',
        },
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ReactQueryCacheProvider queryCache={queryCache}>
          <ButtonBarProvider.ButtonBarProvider>
            <Provider store={store}>
              <Router history={history}>
                <Route path="/incidents/:id">
                  <TitleProvider>
                    <ViewIncident />
                  </TitleProvider>
                </Route>
              </Router>
            </Provider>
          </ButtonBarProvider.ButtonBarProvider>
        </ReactQueryCacheProvider>,
      )
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  afterEach(() => {
    jest.restoreAllMocks()
    queryCache.clear()
  })

  it('should not display a resolve incident button if the user has no ResolveIncident access', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const resolveButton = wrapper.find('Button[color="primary"]')
    expect(resolveButton).toHaveLength(0)
  })

  it('should not display a resolve incident button if the incident is resolved', async () => {
    const mockIncident = { ...mockedIncident, status: 'resolved' } as Incident
    const { wrapper } = await setup(
      [Permissions.ViewIncident, Permissions.ResolveIncident],
      mockIncident,
    )

    const resolveButton = wrapper.find('Button[color="primary"]')
    expect(resolveButton).toHaveLength(0)
  })

  it('should display a resolve incident button if the incident is in a reported state', async () => {
    const { wrapper } = await setup(
      [Permissions.ViewIncident, Permissions.ResolveIncident],
      mockedIncident,
    )
    const buttons = wrapper.find('Button[color="primary"]')
    expect(buttons.at(0).text().trim()).toEqual('incidents.reports.resolve')
  })

  it('should render ViewIncidentDetails', async () => {
    const { wrapper } = await setup(
      [Permissions.ResolveIncident, Permissions.ReportIncident],
      mockedIncident,
    )

    const viewIncidentDetails = wrapper.find(ViewIncidentDetails)
    expect(viewIncidentDetails.exists()).toBeTruthy()
    expect(viewIncidentDetails.prop('incident')).toEqual(mockedIncident)
  })

  it('should call find incident by id', async () => {
    await setup([Permissions.ViewIncident], mockedIncident)

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.find).toHaveBeenCalledWith(mockedIncident.id)
  })

  it('should set the breadcrumbs properly', async () => {
    await setup([Permissions.ViewIncident], mockedIncident)

    expect(breadcrumbUtil.default).toHaveBeenCalledWith([
      { i18nKey: 'incidents.reports.view', location: '/incidents/1234' },
    ])
  })

  it('should mark the status as resolved and fill in the resolved date with the current time', async () => {
    const { wrapper, history } = await setup(
      [Permissions.ViewIncident, Permissions.ResolveIncident],
      mockedIncident,
    )

    const resolveButton = wrapper.find('Button[color="primary"]')
    await act(async () => {
      const onClick = resolveButton.prop('onClick') as any
      await onClick()
    })
    wrapper.update()

    expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1)
    expect(incidentRepositorySaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockedIncident,
        status: 'resolved',
        resolvedOn: expectedResolveDate.toISOString(),
      }),
    )
    expect(history.location.pathname).toEqual('/incidents')
  })

  it('should render tabs header', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const tabs = wrapper.find(TabsHeader)
    expect(tabs.exists()).toBeTruthy()
  })

  it('should render notes tab when clicked', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const notesTab = wrapper.find(Tab)
    act(() => {
      const onClick = notesTab.prop('onClick') as any
      onClick()
    })
    wrapper.update()
    expect(notesTab.exists()).toBeTruthy()
    expect(notesTab.prop('label')).toEqual('patient.notes.label')
  })

  it('should display add new note button', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const button = wrapper.find('Button[color="success"]').at(0)
    expect(button.exists()).toBeTruthy()
    expect(button.text().trim()).toEqual('patient.notes.new')
  })

  it('should not display modal before new note button clicked', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)
    const modal = wrapper.find(NewNoteModal)
    expect(modal.prop('show')).toBeFalsy()
  })

  it('should display modal after new note button clicked', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const newNoteButton = wrapper.find({ className: 'create-new-note-button' }).at(0)
    act(() => {
      const onClick = newNoteButton.prop('onClick') as any
      onClick()
    })
    wrapper.update()
    const modal = wrapper.find(NewNoteModal)
    expect(modal.prop('show')).toBeTruthy()
  })

  it('modal should appear when edit note is clicked', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const tableRow = wrapper.find('tr').at(1)
    await act(async () => {
      const onClick = tableRow.find('button').at(0).prop('onClick') as any
      await onClick({ stopPropagation: jest.fn() })
    })
    wrapper.update()

    const modal = wrapper.find(NewNoteModal)
    expect(modal.prop('show')).toBeTruthy()
  })

  it('one note should disappear when delete button clicked', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const tableRow = wrapper.find('tr').at(1)
    await act(async () => {
      const deleteButton = tableRow.find(Button).at(1)
      const onClick = deleteButton.prop('onClick') as any
      expect(deleteButton.prop('color')).toEqual('danger')
      await onClick({ stopPropagation: jest.fn() })
    })
    wrapper.update()

    expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1)
    expect(incidentRepositorySaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockedIncident,
        notes: [],
      }),
    )
  })

  it('new note should appear when new note is created', async () => {
    const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

    const newNoteButton = wrapper.find({ className: 'create-new-note-button' }).at(0)
    act(() => {
      const onClick = newNoteButton.prop('onClick') as any
      onClick()
    })
    wrapper.update()

    const modal = wrapper.find(NewNoteModal)
    const successButton = modal.find('Button[color="success"]')

    await act(async () => {
      const onChange = modal.find(TextFieldWithLabelFormGroup).prop('onChange') as any
      await onChange({ currentTarget: { value: 'new note text' } })

      const onClick = successButton.prop('onClick') as any
      await onClick({ stopPropagation: jest.fn() })
    })
    wrapper.update()

    expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1)
    expect(incidentRepositorySaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockedIncident,
        notes: [
          ...(mockedIncident.notes || []),
          {
            id: '7777',
            date: expectedResolveDate.toISOString(),
            text: 'new note text',
            givenBy: '8542',
          },
        ],
      }),
    )
  })
})
