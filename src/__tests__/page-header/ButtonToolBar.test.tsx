import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Button } from '@hospitalrun/components'
import { mocked } from 'ts-jest/utils'
import { mount } from 'enzyme'
import * as ButtonBarProvider from '../../page-header/ButtonBarProvider'
import ButtonToolBar from '../../page-header/ButtonToolBar'

describe('Button Tool Bar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the buttons in the provider', () => {
    const buttons: React.ReactNode[] = [
      <Button key="test1">Test 1</Button>,
      <Button key="test2">Test 2</Button>,
    ]
    jest.spyOn(ButtonBarProvider, 'useButtons')
    mocked(ButtonBarProvider).useButtons.mockReturnValue(buttons)

    const wrapper = mount(<ButtonToolBar />)

    expect(wrapper.childAt(0).getElement()).toEqual(buttons[0])
    expect(wrapper.childAt(1).getElement()).toEqual(buttons[1])
  })
})
