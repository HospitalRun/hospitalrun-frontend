import { Button } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AddCarePlanModal from '../../../patients/care-plans/AddCarePlanModal'
import CarePlanTab from '../../../patients/care-plans/CarePlanTab'
import CarePlanTable from '../../../patients/care-plans/CarePlanTable'
import ViewCarePlan from '../../../patients/care-plans/ViewCarePlan'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Care Plan Tab', () => {
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
            <CarePlanTab />
          </Router>
        </Provider>,
      )
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, history }
  }

  it('should render an add care plan button if user has correct permissions', async () => {
    const { wrapper } = await setup('/patients/123/care-plans', [Permissions.AddCarePlan])

    const addNewButton = wrapper.find(Button).at(0)
    expect(addNewButton).toHaveLength(1)
    expect(addNewButton.text().trim()).toEqual('patient.carePlan.new')
  })

  it('should open the add care plan modal on click', async () => {
    const { wrapper } = await setup('/patients/123/care-plans', [Permissions.AddCarePlan])

    act(() => {
      const addNewButton = wrapper.find(Button).at(0)
      const onClick = addNewButton.prop('onClick') as any
      onClick()
    })
    wrapper.update()

    const modal = wrapper.find(AddCarePlanModal)
    expect(modal.prop('show')).toBeTruthy()
  })

  it('should close the modal when the close button is clicked', async () => {
    const { wrapper } = await setup('/patients/123/care-plans', [Permissions.AddCarePlan])

    act(() => {
      const addNewButton = wrapper.find(Button).at(0)
      const onClick = addNewButton.prop('onClick') as any
      onClick()
    })
    wrapper.update()

    act(() => {
      const modal = wrapper.find(AddCarePlanModal)
      const onClose = modal.prop('onCloseButtonClick') as any
      onClose()
    })
    wrapper.update()

    expect(wrapper.find(AddCarePlanModal).prop('show')).toBeFalsy()
  })

  it('should not render care plan button if user does not have permissions', async () => {
    const { wrapper } = await setup('/patients/123/care-plans', [])

    expect(wrapper.find(Button)).toHaveLength(0)
  })

  it('should render the care plans table when on /patient/:id/care-plans', async () => {
    const { wrapper } = await setup('/patients/123/care-plans', [Permissions.ReadCarePlan])

    expect(wrapper.find(CarePlanTable)).toHaveLength(1)
  })

  it('should render the care plan view when on /patient/:id/care-plans/:carePlanId', async () => {
    const { wrapper } = await setup('/patients/123/care-plans/456', [Permissions.ReadCarePlan])

    expect(wrapper.find(ViewCarePlan)).toHaveLength(1)
  })
})
