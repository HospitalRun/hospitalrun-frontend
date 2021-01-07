import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import PatientSearchInput from '../../../patients/search/PatientSearchInput'

describe('Patient Search Input', () => {
  it('should render a text box', () => {
    render(<PatientSearchInput onChange={jest.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should call the on change function when the search input changes after debounce time', () => {
    jest.useFakeTimers()
    const expectedNewQueryString = 'some new query string'
    const onChangeSpy = jest.fn()

    render(<PatientSearchInput onChange={onChangeSpy} />)

    const textbox = screen.getByRole('textbox')
    userEvent.type(textbox, expectedNewQueryString)

    onChangeSpy.mockReset()

    expect(onChangeSpy).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(501)
    })

    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    expect(onChangeSpy).toHaveBeenCalledWith({ queryString: expectedNewQueryString })
  })
})
