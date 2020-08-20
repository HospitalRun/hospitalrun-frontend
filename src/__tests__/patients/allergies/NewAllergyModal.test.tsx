import { Modal, Alert } from '@hospitalrun/components'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import NewAllergyModal from '../../../patients/allergies/NewAllergyModal'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('New Allergy Modal', () => {
  const mockPatient = {
    id: '123',
    givenName: 'someName',
  } as Patient

  const setup = (onCloseSpy = jest.fn()) => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(mockPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)
    const wrapper = mount(
      <NewAllergyModal patientId={mockPatient.id} show onCloseButtonClick={onCloseSpy} />,
    )

    return { wrapper }
  }

  beforeEach(() => {
    console.error = jest.fn()
  })

  it('should render a modal with the correct labels', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)
    expect(wrapper.exists(Modal)).toBeTruthy()
    expect(modal.prop('title')).toEqual('patient.allergies.new')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('patient.allergies.new')
    expect(modal.prop('successButton')?.color).toEqual('success')
    expect(modal.prop('successButton')?.icon).toEqual('add')
  })

  it('should display errors when there is an error saving', async () => {
    const expectedError = {
      message: 'patient.allergies.error.unableToAdd',
      nameError: 'patient.allergies.error.nameRequired',
    }
    const { wrapper } = setup()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const onSave = (modal.prop('successButton') as any).onClick
      await onSave({} as React.MouseEvent<HTMLButtonElement>)
    })
    wrapper.update()

    const alert = wrapper.find(Alert)
    const nameField = wrapper.find(TextInputWithLabelFormGroup)

    expect(alert.prop('title')).toEqual('states.error')
    expect(alert.prop('message')).toEqual(expectedError.message)
    expect(nameField.prop('isInvalid')).toBeTruthy()
    expect(nameField.prop('feedback')).toEqual(expectedError.nameError)
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const { wrapper } = setup(onCloseButtonClickSpy)
      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('closeButton') as any
        onClick()
      })

      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    it('should save the allergy for the given patient', async () => {
      const expectedName = 'expected name'
      const { wrapper } = setup()

      act(() => {
        const input = wrapper.findWhere((c) => c.prop('name') === 'name')
        const onChange = input.prop('onChange')
        onChange({ target: { value: expectedName } })
      })

      wrapper.update()

      await act(async () => {
        const modal = wrapper.find(Modal)
        const onSave = (modal.prop('successButton') as any).onClick
        await onSave({} as React.MouseEvent<HTMLButtonElement>)
      })

      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          allergies: [expect.objectContaining({ name: expectedName })],
        }),
      )
    })
  })
})
