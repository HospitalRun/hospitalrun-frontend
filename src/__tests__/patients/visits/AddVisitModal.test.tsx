import { Modal } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import AddVisitModal from '../../../patients/visits/AddVisitModal'
import VisitForm from '../../../patients/visits/VisitForm'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { VisitStatus } from '../../../shared/model/Visit'

describe('Add Visit Modal', () => {
  const patient = {
    id: 'patientId',
    visits: [
      {
        id: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        type: 'standard type',
        status: VisitStatus.Arrived,
        reason: 'routine',
        location: 'main',
      },
    ],
  } as Patient

  const onCloseSpy = jest.fn()
  const setup = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const history = createMemoryHistory()
    const wrapper = mount(
      <Router history={history}>
        <AddVisitModal show onCloseButtonClick={onCloseSpy} patientId={patient.id} />
      </Router>,
    )

    wrapper.update()

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should render a modal', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)

    expect(modal).toHaveLength(1)

    const successButton = modal.prop('successButton')
    const cancelButton = modal.prop('closeButton')
    expect(modal.prop('title')).toEqual('patient.visits.new')
    expect(successButton?.children).toEqual('patient.visits.new')
    expect(successButton?.icon).toEqual('add')
    expect(cancelButton?.children).toEqual('actions.cancel')
  })

  it('should render the visit form', () => {
    const { wrapper } = setup()

    const addVisitModal = wrapper.find(AddVisitModal)
    expect(addVisitModal).toHaveLength(1)
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

  it('should save the visit when the save button is clicked', async () => {
    const { wrapper } = setup()

    act(() => {
      const visitForm = wrapper.find(VisitForm)
      const onChange = visitForm.prop('onChange') as any
      onChange(patient.visits[0])
    })
    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const successButton = modal.prop('successButton')
      const onClick = successButton?.onClick as any
      await onClick()
    })

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(patient)
  })
})
