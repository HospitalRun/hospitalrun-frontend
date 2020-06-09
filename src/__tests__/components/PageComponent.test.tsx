import '../../__mocks__/matchMediaMock'
import { Button, Select } from '@hospitalrun/components'
import { mount } from 'enzyme'
import React from 'react'

import PageComponent, { defaultPageSize } from '../../components/PageComponent'

describe('PageComponenet test', () => {
  it('should render PageComponent Component', () => {
    const wrapper = mount(
      <PageComponent
        hasNext={false}
        hasPrevious={false}
        pageNumber={1}
        setPreviousPageRequest={jest.fn()}
        setNextPageRequest={jest.fn()}
        onPageSizeChange={jest.fn()}
      />,
    )
    const buttons = wrapper.find(Button)
    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).prop('disabled')).toBeTruthy()
    expect(buttons.at(1).prop('disabled')).toBeTruthy()

    const select = wrapper.find(Select)
    expect(select.prop('defaultValue')).toEqual(defaultPageSize.value?.toString())

    const options = select.find('option')
    expect(options).toHaveLength(5)
  })
})
