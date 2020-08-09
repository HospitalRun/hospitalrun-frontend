import { TextInput } from '@hospitalrun/components'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import PatientSearchRequest from '../../../patients/models/PatientSearchRequest'
import PatientSearchInput from '../../../patients/search/PatientSearchInput'

describe('Patient Search Input', () => {
  const setup = (
    expectedSearchRequest: PatientSearchRequest,
    onChange: (s: PatientSearchRequest) => void,
  ) => {
    const wrapper = mount(
      <PatientSearchInput searchRequest={expectedSearchRequest} onChange={onChange} />,
    )

    return { wrapper }
  }

  it('should render a text box', () => {
    const expectedSearchRequest = { queryString: 'someValue' }
    const { wrapper } = setup(expectedSearchRequest, jest.fn())

    const textInput = wrapper.find(TextInput)
    expect(wrapper.exists(TextInput)).toBeTruthy()
    expect(textInput.prop('size')).toEqual('lg')
    expect(textInput.prop('type')).toEqual('text')
    expect(textInput.prop('value')).toEqual(expectedSearchRequest.queryString)
    expect(textInput.prop('placeholder')).toEqual('actions.search')
  })

  it('should call the on change function when the search input changes after debounce time', () => {
    jest.useFakeTimers()
    const expectedNewQueryString = 'some new query string'
    const expectedSearchRequest = { queryString: 'someValue' }
    const onChangeSpy = jest.fn()
    const { wrapper } = setup(expectedSearchRequest, onChangeSpy)

    act(() => {
      const textInput = wrapper.find(TextInput)
      const onChange = textInput.prop('onChange') as any
      onChange({ currentTarget: { value: expectedNewQueryString } })
    })
    wrapper.update()
    onChangeSpy.mockReset()

    expect(onChangeSpy).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(501)
    })

    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    expect(onChangeSpy).toHaveBeenCalledWith({ queryString: expectedNewQueryString })
  })
})
