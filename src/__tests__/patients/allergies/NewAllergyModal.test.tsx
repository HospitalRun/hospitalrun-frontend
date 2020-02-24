import '../../../__mocks__/matchMediaMock'
import React from 'react'
import NewAllergyModal from 'patients/allergies/NewAllergyModal'
import { shallow, mount } from 'enzyme'
import { Modal, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import Allergy from 'model/Allergy'

describe('New Allergy Modal', () => {
  it('should render a modal with the correct labels', () => {
    const wrapper = shallow(
      <NewAllergyModal show onCloseButtonClick={jest.fn()} onSave={jest.fn()} />,
    )

    const modal = wrapper.find(Modal)
    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patient.allergies.new')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('patient.allergies.new')
    expect(modal.prop('successButton')?.color).toEqual('success')
    expect(modal.prop('successButton')?.icon).toEqual('add')
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const wrapper = shallow(
        <NewAllergyModal show onCloseButtonClick={onCloseButtonClickSpy} onSave={jest.fn()} />,
      )

      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('closeButton') as any
        onClick()
      })

      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    it('should call the onSave function with the correct data when the save button is clicked', () => {
      const expectedName = 'expected name'
      const onSaveSpy = jest.fn()
      const wrapper = mount(
        <NewAllergyModal show onCloseButtonClick={jest.fn()} onSave={onSaveSpy} />,
      )

      act(() => {
        const input = wrapper.findWhere((c) => c.prop('name') === 'name')
        const onChange = input.prop('onChange')
        onChange({ target: { value: expectedName } })
      })

      wrapper.update()

      act(() => {
        const modal = wrapper.find(Modal)
        const onSave = (modal.prop('successButton') as any).onClick
        onSave({} as React.MouseEvent<HTMLButtonElement>)
      })

      expect(onSaveSpy).toHaveBeenCalledTimes(1)
      expect(onSaveSpy).toHaveBeenCalledWith({ name: expectedName } as Allergy)
    })

    it('should display an error message if the name field is not filled out', () => {
      const wrapper = mount(
        <NewAllergyModal
          show
          toggle={jest.fn()}
          onCloseButtonClick={jest.fn()}
          onSave={jest.fn()}
        />,
      )

      act(() => {
        const modal = wrapper.find(Modal)
        const onSave = (modal.prop('successButton') as any).onClick
        onSave({} as React.MouseEvent<HTMLButtonElement>)
      })
      wrapper.update()

      expect(wrapper.find(Alert)).toHaveLength(1)
      expect(wrapper.find(Alert).prop('title')).toEqual('states.error')
      expect(wrapper.find(Alert).prop('message')).toContain('patient.allergies.error.nameRequired')
    })
  })
})
