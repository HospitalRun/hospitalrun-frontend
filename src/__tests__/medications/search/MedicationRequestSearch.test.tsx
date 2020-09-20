import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import MedicationSearchRequest from '../../../medications/models/MedicationSearchRequest'
import MedicationRequestSearch from '../../../medications/search/MedicationRequestSearch'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'

describe('Medication Request Search', () => {
  const setup = (givenSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }) => {
    const onChangeSpy = jest.fn()

    const wrapper = mount(
      <MedicationRequestSearch searchRequest={givenSearchRequest} onChange={onChangeSpy} />,
    )
    wrapper.update()

    return { wrapper: wrapper as ReactWrapper, onChangeSpy }
  }

  it('should render a select component with the default value', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    const { wrapper } = setup(expectedSearchRequest)

    const select = wrapper.find(SelectWithLabelFormGroup)
    expect(select.prop('label')).toEqual('medications.filterTitle')
    expect(select.prop('options')).toEqual([
      { label: 'medications.filter.all', value: 'all' },
      { label: 'medications.status.draft', value: 'draft' },
      { label: 'medications.status.active', value: 'active' },
      { label: 'medications.status.onHold', value: 'on hold' },
      { label: 'medications.status.completed', value: 'completed' },
      { label: 'medications.status.enteredInError', value: 'entered in error' },
      { label: 'medications.status.canceled', value: 'canceled' },
      { label: 'medications.status.unknown', value: 'unknown' },
    ])
    expect(select.prop('defaultSelected')).toEqual([
      {
        label: 'medications.status.draft',
        value: 'draft',
      },
    ])
    expect(select.prop('isEditable')).toBeTruthy()
  })

  it('should update the search request when the filter updates', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    const expectedNewValue = 'canceled'
    const { wrapper, onChangeSpy } = setup(expectedSearchRequest)

    act(() => {
      const select = wrapper.find(SelectWithLabelFormGroup)
      const onChange = select.prop('onChange') as any
      onChange([expectedNewValue])
    })

    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    expect(onChangeSpy).toHaveBeenCalledWith({ ...expectedSearchRequest, status: expectedNewValue })
  })

  it('should render a text input with the default value', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    const { wrapper } = setup(expectedSearchRequest)

    const textInput = wrapper.find(TextInputWithLabelFormGroup)
    expect(textInput.prop('label')).toEqual('medications.search')
    expect(textInput.prop('placeholder')).toEqual('medications.search')
    expect(textInput.prop('value')).toEqual(expectedSearchRequest.text)
    expect(textInput.prop('isEditable')).toBeTruthy()
  })

  it('should update the search request when the text input is updated', () => {
    const expectedSearchRequest: MedicationSearchRequest = { text: '', status: 'draft' }
    const expectedNewValue = 'someNewValue'
    const { wrapper, onChangeSpy } = setup(expectedSearchRequest)

    act(() => {
      const textInput = wrapper.find(TextInputWithLabelFormGroup)
      const onChange = textInput.prop('onChange') as any
      onChange({ target: { value: expectedNewValue } })
    })

    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    expect(onChangeSpy).toHaveBeenCalledWith({ ...expectedSearchRequest, text: expectedNewValue })
  })
})
