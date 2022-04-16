import { fireEvent, render, screen } from '@testing-library/react'
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
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const expectedNote = {
  id: '5678',
  date: new Date().toISOString(),
  text: 'some text',
  givenBy: 'some user',
  deleted: false,
} as Note

const setup = (
  permissions: Permissions[] | undefined,
  id: string | undefined,
  notes: Note[] = [],
) => {
  const expectedIncident = {
    id,
    date: new Date().toISOString(),
    code: 'some code',
    reportedOn: new Date().toISOString(),
    notes,
  } as Incident

  jest.resetAllMocks()
  jest.spyOn(breadcrumbUtil, 'default')
  jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)

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

describe('View Incident', () => {
  it('should not render ViewIncidentDetails if there are no Permissions', async () => {
    const { container } = setup(undefined, '1234')

    expect(container.querySelector(`[class^='css-']`)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: /incidents\.reports\.dateofincident/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('should render tabs header', async () => {
    setup([Permissions.ViewIncident], '1234')

    expect(await screen.findByText('patient.notes.label')).toBeInTheDocument()
  })

  it('should render notes tab and add new note button when clicked', async () => {
    setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234')

    fireEvent.click(await screen.findByText('patient.notes.label'))
    expect(screen.getByRole('button', { name: 'patient.notes.new' })).toBeInTheDocument()
  })

  it('should not display add new note button without permission to report', async () => {
    setup([Permissions.ViewIncident], '1234')

    fireEvent.click(await screen.findByText('patient.notes.label'))
    expect(screen.queryByRole('button', { name: 'patient.notes.new' })).not.toBeInTheDocument()
  })

  it('should not display modal before new note button clicked', async () => {
    setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234')

    fireEvent.click(await screen.findByText('patient.notes.label'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should display modal after new note button is clicked', async () => {
    setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234')

    fireEvent.click(await screen.findByText('patient.notes.label'))
    fireEvent.click(screen.getByRole('button', { name: 'patient.notes.new' }))
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should display modal when edit note is clicked', async () => {
    setup([Permissions.ViewIncident, Permissions.ReportIncident], '1234', [expectedNote])

    fireEvent.click(await screen.findByRole('button', { name: 'actions.edit' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('should not render ViewIncidentDetails when there is no ID', async () => {
    setup([Permissions.ReportIncident, Permissions.ResolveIncident], undefined)

    expect(
      screen.queryByRole('heading', {
        name: /incidents\.reports\.dateofincident/i,
      }),
    ).not.toBeInTheDocument()
  })
})
