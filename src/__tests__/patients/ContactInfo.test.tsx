import '../../__mocks__/matchMediaMock'
import { Column, Spinner } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import { ContactInfoPiece } from '../../model/ContactInformation'
import ContactInfo from '../../patients/ContactInfo'
import * as uuid from '../../util/uuid'

describe('Contact Info in its Editable mode', () => {
  const data = [
    { id: '123', value: '123456', type: 'home' },
    { id: '456', value: '789012', type: undefined },
  ]
  const dataForNoAdd = [
    { id: '123', value: '123456', type: 'home' },
    { id: '456', value: ' ', type: undefined },
  ]
  const errors = ['this is an error', '']
  const label = 'this is a label'
  const name = 'this is a name'
  let onChange: jest.Mock

  const setup = (_data?: ContactInfoPiece[], _errors?: string[]) => {
    const history = createMemoryHistory()
    history.push('/patients/new')
    onChange = jest.fn()

    const wrapper = mount(
      <Router history={history}>
        <ContactInfo
          component="TextInputWithLabelFormGroup"
          data={_data}
          errors={_errors}
          label={label}
          name={name}
          isEditable
          onChange={onChange}
        />
      </Router>,
    )
    return wrapper
  }

  it('should show a spinner if no data is present', () => {
    const wrapper = setup()
    const spinnerWrapper = wrapper.find(Spinner)

    expect(spinnerWrapper).toHaveLength(1)
  })

  it('should call onChange if no data is provided', () => {
    const newId = 'newId'
    jest.spyOn(uuid, 'uuid').mockReturnValue(newId)
    setup()

    const expectedNewData = [{ id: newId, value: '' }]
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should render the labels if data is provided', () => {
    const wrapper = setup(data)
    const headerWrapper = wrapper.find('.header')
    const columnWrappers = headerWrapper.find(Column)
    const expectedTypeLabel = 'patient.contactInfoType.label'

    expect(columnWrappers.at(0).text()).toEqual(`${expectedTypeLabel} & ${label}`)
    expect(columnWrappers.at(1).text()).toEqual(label)
  })

  it('should display the entries if data is provided', () => {
    const wrapper = setup(data)
    for (let i = 0; i < wrapper.length; i += 1) {
      const inputWrapper = wrapper.findWhere((w: any) => w.prop('name') === `${name}${i}`)

      expect(inputWrapper.prop('value')).toEqual(data[i].value)
    }
  })

  it('should display the error if error is provided', () => {
    const wrapper = setup(data, errors)
    const feedbackWrappers = wrapper.find('.invalid-feedback')

    expect(feedbackWrappers).toHaveLength(errors.length * 2)

    for (let i = 0; i < feedbackWrappers.length; i += 1) {
      if (i % 2 === 1) {
        const j = (i - 1) / 2
        expect(feedbackWrappers.at(i).text()).toEqual(errors[j])
      }
    }
  })

  it('should display the add button', () => {
    const wrapper = setup(data)
    const buttonWrapper = wrapper.find('button')

    expect(buttonWrapper.text().trim()).toEqual('actions.add')
  })

  it('should call the onChange callback if select is changed', () => {
    const wrapper = setup(data)
    const select = wrapper.findWhere((w: any) => w.prop('name') === `${name}Type0`).find('select')
    select.getDOMNode<HTMLSelectElement>().value = 'mobile'
    select.simulate('change')

    const expectedNewData = [
      { id: '123', value: '123456', type: 'mobile' },
      { id: '456', value: '789012', type: undefined },
    ]
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should call the onChange callback if input is changed', () => {
    const wrapper = setup(data)
    const input = wrapper.findWhere((w: any) => w.prop('name') === `${name}0`).find('input')
    input.getDOMNode<HTMLInputElement>().value = '777777'
    input.simulate('change')

    const expectedNewData = [
      { id: '123', value: '777777', type: 'home' },
      { id: '456', value: '789012', type: undefined },
    ]
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should call the onChange callback if an add button is clicked with valid entries', () => {
    const wrapper = setup(data)
    const buttonWrapper = wrapper.find('button')
    const onClick = buttonWrapper.prop('onClick') as any
    const newId = 'newId'
    jest.spyOn(uuid, 'uuid').mockReturnValue(newId)

    act(() => {
      onClick()
    })

    const expectedNewData = [...data, { id: newId, value: '' }]

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })

  it('should call the onChange callback if an add button is clicked with an empty entry', () => {
    const wrapper = setup(dataForNoAdd)
    const buttonWrapper = wrapper.find('button')
    const onClick = buttonWrapper.prop('onClick') as any
    const newId = 'newId'
    jest.spyOn(uuid, 'uuid').mockReturnValue(newId)

    act(() => {
      onClick()
    })

    const expectedNewData = [
      { id: '123', value: '123456', type: 'home' },
      { id: newId, value: '' },
    ]

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expectedNewData)
  })
})

describe('Contact Info in its non-Editable mode', () => {
  const data = [
    { id: '123', value: '123456', type: 'home' },
    { id: '456', value: '789012', type: undefined },
  ]
  const label = 'this is a label'
  const name = 'this is a name'

  const setup = (_data?: ContactInfoPiece[]) => {
    const history = createMemoryHistory()
    history.push('/patients/new')

    const wrapper = mount(
      <Router history={history}>
        <ContactInfo
          component="TextInputWithLabelFormGroup"
          data={_data}
          label={label}
          name={name}
        />
      </Router>,
    )
    return wrapper
  }

  it('should render an empty element if no data is present', () => {
    const wrapper = setup()
    const contactInfoWrapper = wrapper.find(ContactInfo)

    expect(contactInfoWrapper.find('div')).toHaveLength(1)
    expect(contactInfoWrapper.containsMatchingElement(<div />)).toEqual(true)
  })

  it('should render the labels if data is provided', () => {
    const wrapper = setup(data)
    const headerWrapper = wrapper.find('.header')
    const columnWrappers = headerWrapper.find(Column)
    const expectedTypeLabel = 'patient.contactInfoType.label'

    expect(columnWrappers.at(0).text()).toEqual(`${expectedTypeLabel} & ${label}`)
    expect(columnWrappers.at(1).text()).toEqual(label)
  })

  it('should display the entries if data is provided', () => {
    const wrapper = setup(data)
    for (let i = 0; i < wrapper.length; i += 1) {
      const inputWrapper = wrapper.findWhere((w: any) => w.prop('name') === `${name}${i}`)

      expect(inputWrapper.prop('value')).toEqual(data[i].value)
    }
  })

  it('should show inputs that are not editable', () => {
    const wrapper = setup(data)
    const inputWrappers = wrapper.find(TextInputWithLabelFormGroup)
    for (let i = 0; i < inputWrappers.length; i += 1) {
      expect(inputWrappers.at(i).prop('isEditable')).toBeFalsy()
    }
  })
})
