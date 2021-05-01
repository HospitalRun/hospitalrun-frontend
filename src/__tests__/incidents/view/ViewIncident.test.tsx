<<<<<<< HEAD
import { Button, Tab, TabsHeader } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'
=======
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
>>>>>>> master
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
<<<<<<< HEAD
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
=======
import { ButtonBarProvider } from '../../../page-header/button-toolbar/ButtonBarProvider'
import { TitleProvider } from '../../../page-header/title/TitleContext'
>>>>>>> master
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Note from '../../../shared/model/Note'
import Permissions from '../../../shared/model/Permissions'
import NewNoteModal from '../../../shared/notes/NewNoteModal'
import { RootState } from '../../../shared/store'
import * as uuid from '../../../shared/util/uuid'

const mockStore = createMockStore<RootState, any>([thunk])

const setup = (permissions: Permissions[], id: string | undefined) => {
  jest.resetAllMocks()
  jest.spyOn(breadcrumbUtil, 'default')
  jest.spyOn(IncidentRepository, 'find').mockResolvedValue({
    id,
    date: new Date().toISOString(),
    code: 'some code',
    reportedOn: new Date().toISOString(),
  } as Incident)

  const history = createMemoryHistory({ initialEntries: [`/incidents/${id}`] })
  const store = mockStore({
    user: {
      permissions,
    },
  } as any)

  return {
    history,
    ...render(
      <ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/incidents/:id">
              <TitleProvider>
                <ViewIncident />
              </TitleProvider>
            </Route>
          </Router>
        </Provider>
      </ButtonBarProvider>,
    ),
  }
}

it('should not render ViewIncidentDetails if there are no Permissions', async () => {
  setup(undefined, '1234')

  expect(
    screen.queryByRole('heading', {
      name: /incidents\.reports\.dateofincident/i,
    }),
  ).not.toBeInTheDocument()
})

  // it('should render tabs header', async () => {
  //   const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

  //   const tabs = wrapper.find(TabsHeader)
  //   expect(tabs.exists()).toBeTruthy()
  // })

  // it('should render notes tab when clicked', async () => {
  //   const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

  //   const notesTab = wrapper.find(Tab)
  //   act(() => {
  //     const onClick = notesTab.prop('onClick') as any
  //     onClick()
  //   })
  //   wrapper.update()
  //   expect(notesTab.exists()).toBeTruthy()
  //   expect(notesTab.prop('label')).toEqual('patient.notes.label')
  // })

  // it('should display add new note button', async () => {
  //   const { wrapper } = await setup(
  //     [Permissions.ViewIncident, Permissions.ReportIncident],
  //     mockedIncident,
  //   )

  //   const button = wrapper.find('Button[color="success"]').at(0)
  //   expect(button.exists()).toBeTruthy()
  //   expect(button.text().trim()).toEqual('patient.notes.new')
  // })

  // it('should not display add new note button without permission to report', async () => {
  //   const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)
  //   const button = wrapper.find('Button[color="success"]').at(0)
  //   expect(button.exists()).toBeFalsy()
  // })

  // it('should not display modal before new note button clicked', async () => {
  //   const { wrapper } = await setup(
  //     [Permissions.ViewIncident, Permissions.ReportIncident],
  //     mockedIncident,
  //   )
  //   const modal = wrapper.find(NewNoteModal)
  //   expect(modal.prop('show')).toBeFalsy()
  // })

  // it('should display modal after new note button clicked', async () => {
  //   const { wrapper } = await setup(
  //     [Permissions.ViewIncident, Permissions.ReportIncident],
  //     mockedIncident,
  //   )

  //   const newNoteButton = wrapper.find({ className: 'create-new-note-button' }).at(0)
  //   act(() => {
  //     const onClick = newNoteButton.prop('onClick') as any
  //     onClick()
  //   })
  //   wrapper.update()
  //   const modal = wrapper.find(NewNoteModal)
  //   expect(modal.prop('show')).toBeTruthy()
  // })

  // it('modal should appear when edit note is clicked', async () => {
  //   const { wrapper } = await setup(
  //     [Permissions.ViewIncident, Permissions.ReportIncident],
  //     mockedIncident,
  //   )

  //   const tableRow = wrapper.find('tr').at(1)
  //   await act(async () => {
  //     const onClick = tableRow.find('button').at(0).prop('onClick') as any
  //     await onClick({ stopPropagation: jest.fn() })
  //   })
  //   wrapper.update()

  //   const modal = wrapper.find(NewNoteModal)
  //   expect(modal.prop('show')).toBeTruthy()
  // })

  // it('one note should disappear when delete button clicked', async () => {
  //   const { wrapper } = await setup([Permissions.ViewIncident], mockedIncident)

  //   const tableRow = wrapper.find('tr').at(1)
  //   await act(async () => {
  //     const deleteButton = tableRow.find(Button).at(1)
  //     const onClick = deleteButton.prop('onClick') as any
  //     expect(deleteButton.prop('color')).toEqual('danger')
  //     await onClick({ stopPropagation: jest.fn() })
  //   })
  //   wrapper.update()

  //   expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1)
  //   expect(incidentRepositorySaveSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       ...mockedIncident,
  //       notes: [],
  //     }),
  //   )
  // })

  // it('new note should appear when new note is created', async () => {
  //   const { wrapper } = await setup(
  //     [Permissions.ViewIncident, Permissions.ReportIncident],
  //     mockedIncident,
  //   )

  //   const newNoteButton = wrapper.find({ className: 'create-new-note-button' }).at(0)
  //   act(() => {
  //     const onClick = newNoteButton.prop('onClick') as any
  //     onClick()
  //   })
  //   wrapper.update()

  //   const newNoteText = 'new note text'
  //   const modal = wrapper.find(NewNoteModal)
  //   await act(async () => {
  //     const onChange = modal.find(TextFieldWithLabelFormGroup).prop('onChange') as any
  //     await onChange({ currentTarget: { value: newNoteText } })
  //   })
  //   wrapper.update()

  //   expect(wrapper.find(NewNoteModal).prop('note').text).toEqual(newNoteText)

  //   const successButton = wrapper.find(NewNoteModal).find('Button[color="success"]')
  //   expect(successButton).toHaveLength(1)
  //   await act(async () => {
  //     const onClick = successButton.prop('onClick') as any
  //     await onClick()
  //   })
  //   wrapper.update()

  //   expect(incidentRepositorySaveSpy).toHaveBeenCalledTimes(1)
  //   expect(incidentRepositorySaveSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       notes: expect.arrayContaining([
  //         {
  //           id: '7777',
  //           date: expectedResolveDate.toISOString(),
  //           text: newNoteText,
  //           givenBy: '8542',
  //         },
  //       ]),
  //     }),
  //   )
  // })

  it('should not render ViewIncidentDetails when there is no ID', async () => {
    setup([Permissions.ReportIncident, Permissions.ResolveIncident], undefined)

    expect(
      screen.queryByRole('heading', {
        name: /incidents\.reports\.dateofincident/i,
      }),
    ).not.toBeInTheDocument()
  })
