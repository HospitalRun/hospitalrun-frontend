import '../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import Breadcrumb from 'components/Breadcrumb'
import {
  Breadcrumb as HrBreadcrumb,
  BreadcrumbItem as HrBreadcrumbItem,
} from '@hospitalrun/components'

describe('Breadcrumb', () => {
  let history = createMemoryHistory()
  const setup = (location: string) => {
    history = createMemoryHistory()
    history.push(location)
    return mount(
      <Router history={history}>
        <Breadcrumb />
      </Router>,
    )
  }

  it('should render the breadcrumb items', () => {
    const wrapper = setup('/patients')
    const breadcrumbItem = wrapper.find(HrBreadcrumbItem)

    expect(wrapper.find(HrBreadcrumb)).toHaveLength(1)
    expect(
      breadcrumbItem.matchesElement(<HrBreadcrumbItem active>patients</HrBreadcrumbItem>),
    ).toBeTruthy()
  })
})
