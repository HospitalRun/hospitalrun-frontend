import '../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import DefaultBreadcrumb, { getItems } from 'components/breadcrumb/DefaultBreadcrumb'
import { BreadcrumbItem as HrBreadcrumbItem } from '@hospitalrun/components'

describe('DefaultBreadcrumb', () => {
  describe('getItems', () => {
    it('should return valid items for pathname /', () => {
      expect(getItems('/')).toEqual([{ url: '/', active: true }])
    })

    it('should return valid items for pathname /patients', () => {
      expect(getItems('/patients')).toEqual([{ url: '/patients', active: true }])
    })

    it('should return valid items for pathname /appointments', () => {
      expect(getItems('/appointments')).toEqual([{ url: '/appointments', active: true }])
    })

    it('should return valid items for pathname /patients/new', () => {
      expect(getItems('/patients/new')).toEqual([
        { url: '/patients', active: false },
        { url: '/patients/new', active: true },
      ])
    })

    it('should return valid items for pathname /appointments/new', () => {
      expect(getItems('/appointments/new')).toEqual([
        { url: '/appointments', active: false },
        { url: '/appointments/new', active: true },
      ])
    })
  })

  describe('rendering', () => {
    const setup = (location: string) => {
      const history = createMemoryHistory()
      history.push(location)
      return mount(
        <Router history={history}>
          <DefaultBreadcrumb />
        </Router>,
      )
    }

    it('should render one breadcrumb item for the path /', () => {
      const wrapper = setup('/')
      expect(wrapper.find(HrBreadcrumbItem)).toHaveLength(1)
    })
  })
})
