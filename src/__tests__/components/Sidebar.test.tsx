import '../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import Sidebar from 'components/Sidebar'
import { Router } from 'react-router'
import { ListItem } from '@hospitalrun/components'
import { act } from '@testing-library/react'

describe('Sidebar', () => {
  let history = createMemoryHistory()
  const setup = (location: string) => {
    history = createMemoryHistory()
    history.push(location)
    return mount(
      <Router history={history}>
        <Sidebar />
      </Router>,
    )
  }

  describe('dashboard link', () => {
    it('should render the dashboard link', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(0)
          .text()
          .trim(),
      ).toEqual('dashboard.label')
    })

    it('should be active when the current path is /', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(0).prop('active')).toBeTruthy()
    })

    it('should navigate to / when the dashboard link is clicked', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      act(() => {
        ;(listItems.at(0).prop('onClick') as any)()
      })

      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients link', () => {
    it('should render the dashboard link', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(1)
          .text()
          .trim(),
      ).toEqual('patients.label')
    })

    it('should be active when the current path is /', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(1).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients when the patients link is clicked', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      act(() => {
        ;(listItems.at(1).prop('onClick') as any)()
      })

      expect(history.location.pathname).toEqual('/patients')
    })
  })
})
