import '../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import Sidebar from 'components/Sidebar'
import { Router } from 'react-router'
import { ListItem } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

const mockStore = configureMockStore([thunk])

describe('Sidebar', () => {
  let history = createMemoryHistory()
  const store = mockStore({
    components: { sidebarCollapsed: false },
  })
  const setup = (location: string) => {
    history = createMemoryHistory()
    history.push(location)
    return mount(
      <Router history={history}>
        <Provider store={store}>
          <Sidebar />
        </Provider>
      </Router>,
    )
  }

  describe('dashboard links', () => {
    it('should render the dashboard link', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(1)
          .text()
          .trim(),
      ).toEqual('dashboard.label')
    })

    it('should be active when the current path is /', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(1).prop('active')).toBeTruthy()
    })

    it('should navigate to / when the dashboard link is clicked', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(1).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/')
    })
  })

  describe('patients links', () => {
    it('should render the patients main link', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(2)
          .text()
          .trim(),
      ).toEqual('patients.label')
    })

    it('should render the new_patient link', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(3)
          .text()
          .trim(),
      ).toEqual('patients.newPatient')
    })

    it('should render the patients_list link', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(4)
          .text()
          .trim(),
      ).toEqual('patients.patientsList')
    })

    it('main patients link should be active when the current path is /patients', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(2).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients when the patients main link is clicked', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(2).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/patients')
    })

    it('new patient should be active when the current path is /patients/new', () => {
      const wrapper = setup('/patients/new')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(3).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients/new when the patients new link is clicked', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(3).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/patients/new')
    })

    it('patients list link should be active when the current path is /patients', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients when the patients list link is clicked', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(4).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/patients')
    })
  })

  describe('appointments link', () => {
    it('should render the scheduling link', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(3)
          .text()
          .trim(),
      ).toEqual('scheduling.label')
    })

    it('should render the new appointment link', () => {
      const wrapper = setup('/appointments/new')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(4)
          .text()
          .trim(),
      ).toEqual('scheduling.appointments.new')
    })

    it('should render the appointments schedule link', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(5)
          .text()
          .trim(),
      ).toEqual('scheduling.appointments.schedule')
    })

    it('main scheduling link should be active when the current path is /appointments', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(3).prop('active')).toBeTruthy()
    })

    it('should navigate to /appointments when the main scheduling link is clicked', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(3).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })

    it('new appointment link should be active when the current path is /appointments/new', () => {
      const wrapper = setup('/appointments/new')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).prop('active')).toBeTruthy()
    })

    it('should navigate to /appointments/new when the new appointment link is clicked', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(4).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments/new')
    })

    it('appointments schedule link should be active when the current path is /appointments', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(5).prop('active')).toBeTruthy()
    })

    it('should navigate to /appointments when the appointments schedule link is clicked', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(5).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })

  describe('labs links', () => {
    it('should render the main labs link', () => {
      const wrapper = setup('/labs')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(4)
          .text()
          .trim(),
      ).toEqual('labs.label')
    })

    it('should render the new labs request link', () => {
      const wrapper = setup('/labs')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(5)
          .text()
          .trim(),
      ).toEqual('labs.requests.new')
    })

    it('should render the labs list link', () => {
      const wrapper = setup('/labs')

      const listItems = wrapper.find(ListItem)

      expect(
        listItems
          .at(6)
          .text()
          .trim(),
      ).toEqual('labs.requests.label')
    })

    it('main labs link should be active when the current path is /labs', () => {
      const wrapper = setup('/labs')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).prop('active')).toBeTruthy()
    })

    it('should navigate to /labs when the main lab link is clicked', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(4).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/labs')
    })

    it('new lab request link should be active when the current path is /labs/new', () => {
      const wrapper = setup('/labs/new')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(5).prop('active')).toBeTruthy()
    })

    it('should navigate to /labs/new when the new labs link is clicked', () => {
      const wrapper = setup('/labs')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(5).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/labs/new')
    })

    it('labs list link should be active when the current path is /labs', () => {
      const wrapper = setup('/labs')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(6).prop('active')).toBeTruthy()
    })

    it('should navigate to /labs when the labs list link is clicked', () => {
      const wrapper = setup('/labs/new')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(6).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/labs')
    })
  })
})
