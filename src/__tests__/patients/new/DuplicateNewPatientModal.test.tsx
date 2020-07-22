import { Modal } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import DuplicateNewPatientModal from '../../../patients/new/DuplicateNewPatientModal'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const setupOnClick = (onClose: any, onContinue: any, prop: string) => {
  const store = mockStore({
    patient: {
      patient: {
        id: '1234',
      },
    },
  } as any)

  const wrapper = mount(
    <Provider store={store}>
      <DuplicateNewPatientModal
        show
        toggle={jest.fn()}
        onCloseButtonClick={onClose}
        onContinueButtonClick={onContinue}
      />
    </Provider>,
  )
  wrapper.update()

  act(() => {
    const modal = wrapper.find(Modal)
    const { onClick } = modal.prop(prop) as any
    onClick()
  })

  return { wrapper: wrapper as ReactWrapper }
}

describe('Duplicate New Patient Modal', () => {
  it('should render a modal with the correct labels', () => {
    const store = mockStore({
      patient: {
        patient: {
          id: '1234',
        },
      },
    } as any)
    const wrapper = mount(
      <Provider store={store}>
        <DuplicateNewPatientModal
          show
          toggle={jest.fn()}
          onCloseButtonClick={jest.fn()}
          onContinueButtonClick={jest.fn()}
        />
      </Provider>,
    )
    wrapper.update()
    const modal = wrapper.find(Modal)
    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patients.newPatient')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('actions.save')
    expect(modal.prop('successButton')?.color).toEqual('success')
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const closeButtonProp = 'closeButton'
      setupOnClick(onCloseButtonClickSpy, jest.fn(), closeButtonProp)
      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('on save', () => {
    it('should call the onContinueButtonClick function when the continue button is clicked', () => {
      const onContinueButtonClickSpy = jest.fn()
      const continueButtonProp = 'successButton'
      setupOnClick(jest.fn(), onContinueButtonClickSpy, continueButtonProp)
      expect(onContinueButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })
})
