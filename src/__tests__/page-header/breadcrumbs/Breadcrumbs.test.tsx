import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Breadcrumbs from '../../../page-header/breadcrumbs/Breadcrumbs'
import Breadcrumb from '../../../shared/model/Breadcrumb'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Breadcrumbs', () => {
  const setup = (breadcrumbs: Breadcrumb[]) => {
    const history = createMemoryHistory()
    const store = mockStore({
      breadcrumbs: { breadcrumbs },
    } as any)

    return render(
      <Provider store={store}>
        <Router history={history}>
          <Breadcrumbs />
        </Router>
      </Provider>,
    )
  }

  it('should not render the breadcrumb when there are no items in the store', () => {
    setup([])

    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('should render breadcrumbs items', () => {
    const breadcrumbs = [
      { i18nKey: 'patient.label', location: '/patient' },
      { text: 'Bob', location: '/patient/1' },
      { text: 'Edit Patient', location: '/patient/1/edit' },
    ]

    setup(breadcrumbs)

    const breadCrumbItems = screen.getAllByRole('listitem')

    expect(breadCrumbItems).toHaveLength(3)
    expect(breadCrumbItems[0]).toHaveTextContent('patient.label')
    expect(breadCrumbItems[1]).toHaveTextContent('Bob')
    expect(breadCrumbItems[2]).toHaveTextContent('Edit Patient')
  })
})
