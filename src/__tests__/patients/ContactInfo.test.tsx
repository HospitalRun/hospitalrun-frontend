import '../../__mocks__/matchMediaMock'
import { Column, Spinner } from '@hospitalrun/components'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
// import { Provider } from 'react-redux'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'
// import createMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'

// import Patient from '../../model/Patient'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import { ContactInfoPiece } from '../../model/ContactInformation'
import ContactInfo from '../../patients/ContactInfo'
// import { RootState } from '../../store'

// const mockStore = createMockStore<RootState, any>([thunk])

describe('Contact Info in its Editable mode', () => {
  const data = [
    { value: '123456', type: undefined },
    { value: '789012', type: undefined },
  ]
  const errors = ['this is an error', '']
  const label = 'this is a label'
  const name = 'this is a name'
  let onChange: jest.Mock
  // const isValid = jest.fn()

  const setup = (_data?: ContactInfoPiece[], _errors?: string[]) => {
    const history = createMemoryHistory()
    history.push('/patients/new')
    onChange = jest.fn()

    const wrapper = mount(
      <Router history={history}>
        <ContactInfo
          data={_data}
          errors={_errors}
          label={label}
          name={name}
          isEditable
          onChange={onChange}
          type="tel"
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
    setup()

    expect(onChange).toHaveBeenCalledTimes(1)
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

  it('should call the onChange callback if input is changed', () => {
    const wrapper = setup(data)
    const input = wrapper.findWhere((w: any) => w.prop('name') === `${name}0`).find('input')
    input.getDOMNode<HTMLInputElement>().value = '777777'
    input.simulate('change')

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should call the onChange callback if an add button is clicked with valid entries', () => {
    const wrapper = setup(data)
    const buttonWrapper = wrapper.find('button')
    const onClick = buttonWrapper.prop('onClick') as any

    act(() => {
      onClick()
    })

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe('Contact Info in its non-Editable mode', () => {
  const data = [
    { value: '123456', type: undefined },
    { value: '789012', type: undefined },
  ]
  const label = 'this is a label'
  const name = 'this is a name'

  const setup = (_data?: ContactInfoPiece[]) => {
    const history = createMemoryHistory()
    history.push('/patients/new')

    const wrapper = mount(
      <Router history={history}>
        <ContactInfo data={_data} label={label} name={name} type="tel" />
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
      expect(inputWrappers.at(i).prop('onChange')).toBeUndefined()
    }
  })
})
