import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AddCareGoalModal from '../../../patients/care-goals/AddCareGoalModal'
import CareGoalTab from '../../../patients/care-goals/CareGoalTab'
import CareGoalTable from '../../../patients/care-goals/CareGoalTable'
import ViewCareGoal from '../../../patients/care-goals/ViewCareGoal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Care Goals Tab', () => {
  const patient = { id: 'patientId' } as Patient

  const setup = async (route: string, permissions: Permissions[]) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    const store = mockStore({ user: { permissions } } as any)
    const history = createMemoryHistory()
    history.push(route)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/patients/:id/care-goals">
              <CareGoalTab />
            </Route>
          </Router>
        </Provider>,
      )
    })
    wrapper.update()

    return wrapper as ReactWrapper
  }

  it('should render add care goal button if user has correct permissions', async () => {
    const wrapper = await setup('patients/123/care-goals', [Permissions.AddCareGoal])

    const addNewButton = wrapper.find('Button').at(0)
    expect(addNewButton).toHaveLength(1)
    expect(addNewButton.text().trim()).toEqual('patient.careGoal.new')
  })

  it('should not render add care goal button if user does not have permissions', async () => {
    const wrapper = await setup('patients/123/care-goals', [])

    const addNewButton = wrapper.find('Button')
    expect(addNewButton).toHaveLength(0)
  })

  it('should open the add care goal modal on click', async () => {
    const wrapper = await setup('patients/123/care-goals', [Permissions.AddCareGoal])

    await act(async () => {
      const addNewButton = wrapper.find('Button').at(0)
      const onClick = addNewButton.prop('onClick') as any
      onClick()
    })

    wrapper.update()

    const modal = wrapper.find(AddCareGoalModal)
    expect(modal.prop('show')).toBeTruthy()
  })

  it('should close the modal when the close button is clicked', async () => {
    const wrapper = await setup('patients/123/care-goals', [Permissions.AddCareGoal])

    await act(async () => {
      const addNewButton = wrapper.find('Button').at(0)
      const onClick = addNewButton.prop('onClick') as any
      onClick()
    })

    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(AddCareGoalModal)
      const onClose = modal.prop('onCloseButtonClick') as any
      onClose()
    })

    wrapper.update()

    const modal = wrapper.find(AddCareGoalModal)
    expect(modal.prop('show')).toBeFalsy()
  })

  it('should render care goal table when on patients/123/care-goals', async () => {
    const wrapper = await setup('patients/123/care-goals', [Permissions.ReadCareGoal])

    const careGoalTable = wrapper.find(CareGoalTable)
    expect(careGoalTable).toHaveLength(1)
  })

  it('should render care goal view when on patients/123/care-goals/456', async () => {
    const wrapper = await setup('patients/123/care-goals/456', [Permissions.ReadCareGoal])

    const viewCareGoal = wrapper.find(ViewCareGoal)
    expect(viewCareGoal).toHaveLength(1)
  })
})
