import { Button } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AddVisitModal from '../../../patients/visits/AddVisitModal'
import ViewVisit from '../../../patients/visits/ViewVisit'
import VisitTab from '../../../patients/visits/VisitTab'
import VisitTable from '../../../patients/visits/VisitTable'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Visit Tab', () => {
  const patient = {
    id: 'patientId',
  }

  const setup = (route: string, permissions: Permissions[]) => {
    const store = mockStore({ patient: { patient }, user: { permissions } } as any)
    const history = createMemoryHistory()
    history.push(route)
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <VisitTab />
        </Router>
      </Provider>,
    )

    wrapper.update()
    return { wrapper, history }
  }

  it('should render an add visit button if user has correct permissions', () => {
    const { wrapper } = setup('/patients/123/visits', [Permissions.AddVisit])

    const addNewButton = wrapper.find(Button).at(0)
    expect(addNewButton).toHaveLength(1)
    expect(addNewButton.text().trim()).toEqual('patient.visits.new')
  })

  it('should open the add visit modal on click', () => {
    const { wrapper } = setup('/patients/123/visits', [Permissions.AddVisit])

    act(() => {
      const addNewButton = wrapper.find(Button).at(0)
      const onClick = addNewButton.prop('onClick') as any
      onClick()
    })
    wrapper.update()

    const modal = wrapper.find(AddVisitModal)
    expect(modal.prop('show')).toBeTruthy()
  })

  it('should close the modal when the close button is clicked', () => {
    const { wrapper } = setup('/patients/123/visits', [Permissions.AddVisit])

    act(() => {
      const addNewButton = wrapper.find(Button).at(0)
      const onClick = addNewButton.prop('onClick') as any
      onClick()
    })
    wrapper.update()

    act(() => {
      const modal = wrapper.find(AddVisitModal)
      const onClose = modal.prop('onCloseButtonClick') as any
      onClose()
    })
    wrapper.update()

    expect(wrapper.find(AddVisitModal).prop('show')).toBeFalsy()
  })

  it('should not render visit button if user does not have permissions', () => {
    const { wrapper } = setup('/patients/123/visits', [])

    expect(wrapper.find(Button)).toHaveLength(0)
  })

  it('should render the visits table when on /patient/:id/visits', () => {
    const { wrapper } = setup('/patients/123/visits', [Permissions.ReadVisits])

    expect(wrapper.find(VisitTable)).toHaveLength(1)
  })

  it('should render the visit view when on /patient/:id/visits/:visitId', () => {
    const { wrapper } = setup('/patients/123/visits/456', [Permissions.ReadVisits])

    expect(wrapper.find(ViewVisit)).toHaveLength(1)
  })
})
