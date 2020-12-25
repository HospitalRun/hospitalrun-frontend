import { screen, render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import VisitTab from '../../../patients/visits/VisitTab'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Visit Tab', () => {
  const patient = {
    id: 'patientId',
  }

  const setup = (route: string, permissions: Permissions[]) => {
    const store = mockStore({ user: { permissions } } as any)
    const history = createMemoryHistory()
    history.push(route)

    return {
      history,
      ...render(
        <Provider store={store}>
          <Router history={history}>
            <VisitTab patientId={patient.id} />
          </Router>
        </Provider>,
      ),
    }
  }

  it('should render an add visit button if user has correct permissions', () => {
    setup('/patients/123/visits', [Permissions.AddVisit])

    // const addNewButton = wrapper.find(Button).at(0)
    // expect(addNewButton).toHaveLength(1)
    // expect(addNewButton.text().trim()).toEqual('patient.visits.new')
  })

  it('should open the add visit modal on click', () => {
    setup('/patients/123/visits', [Permissions.AddVisit])

    // act(() => {
    //   const addNewButton = wrapper.find(Button).at(0)
    //   const onClick = addNewButton.prop('onClick') as any
    //   onClick()
    // })
    // wrapper.update()

    // const modal = wrapper.find(AddVisitModal)
    // expect(modal.prop('show')).toBeTruthy()
  })

  it('should close the modal when the close button is clicked', () => {
    setup('/patients/123/visits', [Permissions.AddVisit])

    // act(() => {
    //   const addNewButton = wrapper.find(Button).at(0)
    //   const onClick = addNewButton.prop('onClick') as any
    //   onClick()
    // })
    // wrapper.update()

    // act(() => {
    //   const modal = wrapper.find(AddVisitModal)
    //   const onClose = modal.prop('onCloseButtonClick') as any
    //   onClose()
    // })
    // wrapper.update()

    // expect(wrapper.find(AddVisitModal).prop('show')).toBeFalsy()
  })

  it('should not render visit button if user does not have permissions', () => {
    setup('/patients/123/visits', [])

    // expect(wrapper.find(Button)).toHaveLength(0)
  })

  it('should render the visits table when on /patient/:id/visits', () => {
    setup('/patients/123/visits', [Permissions.ReadVisits])

    // expect(wrapper.find(VisitTable)).toHaveLength(1)
  })

  it('should render the visit view when on /patient/:id/visits/:visitId', () => {
    setup('/patients/123/visits/456', [Permissions.ReadVisits])

    // expect(wrapper.find(ViewVisit)).toHaveLength(1)
  })
})
