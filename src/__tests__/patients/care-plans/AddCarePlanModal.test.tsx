import '../../../__mocks__/matchMediaMock'
import { Modal } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from '../../../clients/db/PatientRepository'
import { CarePlanIntent, CarePlanStatus } from '../../../model/CarePlan'
import Patient from '../../../model/Patient'
import AddCarePlanModal from '../../../patients/care-plans/AddCarePlanModal'
import CarePlanForm from '../../../patients/care-plans/CarePlanForm'
import * as patientSlice from '../../../patients/patient-slice'
import { RootState } from '../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Add Care Plan Modal', () => {
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    carePlans: [
      {
        id: '123',
        title: 'some title',
        description: 'some description',
        diagnosisId: '123',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: CarePlanStatus.Active,
        intent: CarePlanIntent.Proposal,
      },
    ],
  } as Patient

  const carePlanError = {
    title: 'some care plan error',
  }

  const onCloseSpy = jest.fn()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const store = mockStore({ patient: { patient, carePlanError } } as any)
    const history = createMemoryHistory()
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <AddCarePlanModal show onCloseButtonClick={onCloseSpy} />
        </Router>
      </Provider>,
    )

    wrapper.update()
    return { wrapper }
  }

  it('should render a modal', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)

    expect(modal).toHaveLength(1)

    const successButton = modal.prop('successButton')
    const cancelButton = modal.prop('closeButton')
    expect(modal.prop('title')).toEqual('patient.carePlan.new')
    expect(successButton?.children).toEqual('patient.carePlan.new')
    expect(successButton?.icon).toEqual('add')
    expect(cancelButton?.children).toEqual('actions.cancel')
  })

  it('should render the care plan form', () => {
    const { wrapper } = setup()

    const carePlanForm = wrapper.find(CarePlanForm)
    expect(carePlanForm).toHaveLength(1)
    expect(carePlanForm.prop('carePlanError')).toEqual(carePlanError)
    expect(carePlanForm.prop('patient')).toEqual(patient)
  })

  it('should dispatch add care plan when the save button is clicked', async () => {
    const { wrapper } = setup()
    jest.spyOn(patientSlice, 'addCarePlan')

    act(() => {
      const carePlanForm = wrapper.find(CarePlanForm)
      const onChange = carePlanForm.prop('onChange') as any
      onChange(patient.carePlans[0])
    })
    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const successButton = modal.prop('successButton')
      const onClick = successButton?.onClick as any
      await onClick()
    })

    expect(patientSlice.addCarePlan).toHaveBeenCalledTimes(1)
    expect(patientSlice.addCarePlan).toHaveBeenCalledWith(patient.id, patient.carePlans[0])
  })

  it('should call the on close function when the cancel button is clicked', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)

    expect(modal).toHaveLength(1)

    act(() => {
      const cancelButton = modal.prop('closeButton')
      const onClick = cancelButton?.onClick as any
      onClick()
    })

    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
})
