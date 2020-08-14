import { Modal } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import AddCarePlanModal from '../../../patients/care-plans/AddCarePlanModal'
import CarePlanForm from '../../../patients/care-plans/CarePlanForm'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Patient from '../../../shared/model/Patient'

describe('Add Care Plan Modal', () => {
  const patient = {
    id: 'patientId',
    diagnoses: [{ id: '123', name: 'some name', diagnosisDate: new Date().toISOString() }],
    carePlans: [] as CarePlan[],
  } as Patient

  const onCloseSpy = jest.fn()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const history = createMemoryHistory()
    const wrapper = mount(
      <Router history={history}>
        <AddCarePlanModal patient={patient} show onCloseButtonClick={onCloseSpy} />
      </Router>,
    )

    wrapper.update()
    return { wrapper }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

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
    expect(carePlanForm.prop('patient')).toEqual(patient)
  })

  it('should save care plan when the save button is clicked and close', async () => {
    const expectedCreatedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedCreatedDate)
    const expectedCarePlan = {
      id: '123',
      title: 'some title',
      description: 'some description',
      diagnosisId: '123',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: CarePlanStatus.Active,
      intent: CarePlanIntent.Proposal,
      createdOn: expectedCreatedDate,
    }

    const { wrapper } = setup()
    await act(async () => {
      const carePlanForm = wrapper.find(CarePlanForm)
      const onChange = carePlanForm.prop('onChange') as any
      await onChange(expectedCarePlan)
    })
    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const successButton = modal.prop('successButton')
      const onClick = successButton?.onClick as any
      await onClick()
    })

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith({
      ...patient,
      carePlans: [expectedCarePlan],
    })
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
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
