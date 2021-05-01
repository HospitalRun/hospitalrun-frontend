import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewIncident from '../../../incidents/view/ViewIncident'
import * as breadcrumbUtil from '../../../page-header/breadcrumbs/useAddBreadcrumbs'
import { ButtonBarProvider } from '../../../page-header/button-toolbar/ButtonBarProvider'
import { TitleProvider } from '../../../page-header/title/TitleContext'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Note from '../../../shared/model/Note'
import Permissions from '../../../shared/model/Permissions'
import NewNoteModal from '../../../shared/notes/NewNoteModal'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const MOCK_NOTE = {
  id: '1234',
  date: new Date().toISOString(),
  text: 'some text',
  givenBy: 'some user',
}

const setup = (permissions: Permissions[], id: string | undefined, notes: Note[] = []) => {
  jest.resetAllMocks()
  jest.spyOn(breadcrumbUtil, 'default')
  console.log("NOTES", notes)
  jest.spyOn(IncidentRepository, 'find').mockResolvedValue({
    id,
    date: new Date().toISOString(),
    code: 'some code',
    reportedOn: new Date().toISOString(),
    notes
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
  setup([], '1234')

  expect(
    screen.queryByRole('heading', {
      name: /incidents\.reports\.dateofincident/i,
    }),
  ).not.toBeInTheDocument()
})

it('should render tabs header', async () => {
  setup([Permissions.ViewIncident], '1234')
  expect(screen.getByText("patient.notes.label")).toBeInTheDocument();
})

it('should render notes tab and add new note button when clicked', async () => {
  setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234')
  fireEvent.click(screen.getByText("patient.notes.label")) 
  expect(screen.getByRole("button", { name: "patient.notes.new" })).toBeInTheDocument();
})

it('should not display add new note button without permission to report', async () => {
  setup([Permissions.ViewIncident], '1234')
  fireEvent.click(screen.getByText("patient.notes.label"))
  expect(screen.queryByRole("button", { name: "patient.notes.new" })).not.toBeInTheDocument();
})

it('should not display modal before new note button clicked', async () => {
  setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234')
  fireEvent.click(screen.getByText("patient.notes.label"))
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
})

it('should display modal after new note button clicked', async () => {
  setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234');
  fireEvent.click(screen.getByText("patient.notes.label"))
  fireEvent.click(screen.getByRole("button", { name: "patient.notes.new" }))
  expect(screen.queryByRole("dialog")).toBeInTheDocument();
})

// it('modal should appear when edit note is clicked', async () => {
//   setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234', [MOCK_NOTE])
//   fireEvent.click(screen.getByRole("button", { name: "actions.edit" }))
//   await waitFor(() => {
//     expect(screen.queryByRole("dialog")).toBeInTheDocument();
//   })
  
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

  // it('should not render ViewIncidentDetails when there is no ID', async () => {
  //   setup([Permissions.ReportIncident, Permissions.ResolveIncident], undefined)

  //   expect(
  //     screen.queryByRole('heading', {
  //       name: /incidents\.reports\.dateofincident/i,
  //     }),
  //   ).not.toBeInTheDocument()
  // })
