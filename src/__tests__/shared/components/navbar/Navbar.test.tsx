import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Navbar from '../../../../shared/components/navbar/Navbar'
import pageMap from '../../../../shared/components/navbar/pageMap'
import Permissions from '../../../../shared/model/Permissions'
import User from '../../../../shared/model/User'
import { RootState } from '../../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Navbar', () => {
  const setup = (permissions: Permissions[], user?: User) => {
    const history = createMemoryHistory()
    const store = mockStore({
      title: '',
      user: { permissions, user },
    } as any)

    return {
      history,
      ...render(
        <Provider store={store}>
          <Router history={history}>
            <Navbar />
          </Router>
        </Provider>,
      ),
    }
  }

  const userName = {
    givenName: 'givenName',
    familyName: 'familyName',
  } as User

  const allPermissions = Object.values(Permissions)

  describe('hamberger', () => {
    it('should render a hamberger link list', () => {
      setup(allPermissions)

      const navButton = screen.getByRole('button', { hidden: false })
      userEvent.click(navButton)

      // We want all the labels from the page mapping to be rendered when we have all permissions
      const expectedLabels = Object.values(pageMap).map((pm) => pm.label)

      // Checks both order, and length - excluding buttons with no label
      const renderedLabels = screen
        .getAllByRole('button')
        .map((b) => b.textContent)
        .filter((s) => s)
      expect(renderedLabels).toStrictEqual(expectedLabels)
    })

    it('should not show an item if user does not have a permission', () => {
      // exclude labs, incidents, and imagings permissions
      // NOTE: "View Imagings" is based on the ReadPatients permission - not an Imagings permission
      const excludedPermissions = [
        Permissions.ViewLab,
        Permissions.ViewLabs,
        Permissions.CancelLab,
        Permissions.RequestLab,
        Permissions.CompleteLab,
        Permissions.ViewIncident,
        Permissions.ViewIncidents,
        Permissions.ViewIncidentWidgets,
        Permissions.ReportIncident,
        Permissions.ResolveIncident,
        Permissions.ViewImagings,
        Permissions.RequestImaging,
      ]
      setup(allPermissions.filter((p) => !excludedPermissions.includes(p)))
      const navButton = screen.getByRole('button', { hidden: false })
      userEvent.click(navButton)

      const unexpectedLabels = Object.values(pageMap)
        .filter((pm) => excludedPermissions.includes(pm.permission as Permissions))
        .map((pm) => pm.label)

      unexpectedLabels.forEach((label) => expect(screen.queryByText(label)).not.toBeInTheDocument())
    })

    describe('header', () => {
      it('should render a HospitalRun Navbar', () => {
        setup(allPermissions)

        expect(screen.getByText(/hospitalrun/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { hidden: false })).toBeInTheDocument()
      })

      it('should navigate to / when the header is clicked', () => {
        const { history } = setup(allPermissions)

        history.location.pathname = '/enterprise-1701'
        expect(history.location.pathname).not.toEqual('/')
        userEvent.click(screen.getByText(/hospitalrun/i))

        expect(history.location.pathname).toEqual('/')
      })
    })

    describe('add new', () => {
      it('should show a shortcut if user has a permission', () => {
        setup(allPermissions)

        const navButton = screen.getByRole('button', { hidden: false })
        userEvent.click(navButton)
        expect(
          screen.getByRole('button', {
            name: /patients\.newpatient/i,
          }),
        ).toBeInTheDocument()

        // 0 & 1 index are dashboard fixed elements, 2 index is first menu label for user
        expect(screen.queryAllByRole('button')[2]).toHaveTextContent(/patients\.newpatient/i)
      })
    })

    describe('account', () => {
      it("should render a link with the user's identification", () => {
        const { container } = setup(allPermissions, userName)
        const navButton = container.querySelector('.nav-account')?.firstElementChild as Element
        userEvent.click(navButton)

        expect(
          screen.getByText(/user\.login\.currentlysignedinas givenname familyname/i),
        ).toBeInTheDocument()
      })

      it('should render a setting link list', () => {
        setup(allPermissions)
        const { container } = setup(allPermissions, userName)

        const navButton = container.querySelector('.nav-account')?.firstElementChild as Element
        userEvent.click(navButton)

        expect(screen.getByText('settings.label')).toBeInTheDocument()
      })

      it('should navigate to /settings when the list option is selected', () => {
        setup(allPermissions)
        const { history, container } = setup(allPermissions, userName)

        const navButton = container.querySelector('.nav-account')?.firstElementChild as Element
        userEvent.click(navButton)
        userEvent.click(screen.getByText('settings.label'))

        expect(history.location.pathname).toEqual('/settings')
      })
    })
  })
})
