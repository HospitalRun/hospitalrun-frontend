import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import DuplicateNewPatientModal from '../../../patients/new/DuplicateNewPatientModal'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

const setup = (onClose: any, onContinue: any) => {
  const store = mockStore({
    patient: {
      patient: {
        id: '1234',
      },
    },
  } as any)

  return render(
    <Provider store={store}>
      <DuplicateNewPatientModal
        show
        toggle={jest.fn()}
        onCloseButtonClick={onClose}
        onContinueButtonClick={onContinue}
      />
    </Provider>,
  )
}

describe('Duplicate New Patient Modal', () => {
  it('should render a modal with the correct labels', () => {
    const onClose = jest.fn
    const onContinue = jest.fn
    setup(onClose, onContinue)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-warning')

    expect(screen.getByText(/patients\.warning/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /actions\.cancel/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /actions\.save/i,
      }),
    ).toBeInTheDocument()
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      setup(onCloseButtonClickSpy, jest.fn())

      userEvent.click(
        screen.getByRole('button', {
          name: /actions\.cancel/i,
        }),
      )
      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('on save', () => {
    it('should call the onContinueButtonClick function when the continue button is clicked', () => {
      const onContinueButtonClickSpy = jest.fn()
      setup(jest.fn(), onContinueButtonClickSpy)

      userEvent.click(
        screen.getByRole('button', {
          name: /actions\.save/i,
        }),
      )
      expect(onContinueButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })
})
