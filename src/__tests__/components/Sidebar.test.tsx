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

  describe('dashboard link', () => {
    it('should render the dashboard link', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(1).text().trim()).toEqual('dashboard.label')
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

  describe('patients link', () => {
    it('should render the dashboard link', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(2).text().trim()).toEqual('patients.label')
    })

    it('should be active when the current path is /', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(2).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients when the patients link is clicked', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(2).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/patients')
    })
  })

  describe('patients_list link', () => {
    it('should render the patients_list link', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).text().trim()).toEqual('patients.patientsList')
    })

    it('should be active when the current path is /patients', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients when the patients link is clicked', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(4).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/patients')
    })
  })

  describe('new_patient link', () => {
    it('should render the new_patient link', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(3).text().trim()).toEqual('patients.newPatient')
    })

    it('should be active when the current path is /patients/new', () => {
      const wrapper = setup('/patients/new')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(3).prop('active')).toBeTruthy()
    })

    it('should navigate to /patients/new when the patients link is clicked', () => {
      const wrapper = setup('/patients')

      const listItems = wrapper.find(ListItem)

      act(() => {
        ;(listItems.at(3).prop('onClick') as any)()
      })

      expect(history.location.pathname).toEqual('/patients/new')
    })
  })

  describe('appointments link', () => {
    it('should render the scheduling link', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(3).text().trim()).toEqual('scheduling.label')
    })

    it('should be active when the current path is /appointments', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(3).prop('active')).toBeTruthy()
    })

    it('should navigate to /appointments when the scheduling link is clicked', () => {
      const wrapper = setup('/')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(3).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })

  describe('appointment_schedule link', () => {
    it('should render the appointment_schedule link', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(5).text().trim()).toEqual('scheduling.appointments.schedule')
    })

    it('should be active when the current path is /appointments', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(5).prop('active')).toBeTruthy()
    })

    it('should navigate to /appointments when the appointments_schedule link is clicked', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(5).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments')
    })
  })

  describe('new_appointment link', () => {
    it('should render the new_appointment link', () => {
      const wrapper = setup('/appointments/new')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).text().trim()).toEqual('scheduling.appointments.new')
    })

    it('should be active when the current path is /appointments/new', () => {
      const wrapper = setup('/appointments/new')

      const listItems = wrapper.find(ListItem)

      expect(listItems.at(4).prop('active')).toBeTruthy()
    })

    it('should navigate to /appointments/new when the new_appointment link is clicked', () => {
      const wrapper = setup('/appointments')

      const listItems = wrapper.find(ListItem)

      act(() => {
        const onClick = listItems.at(4).prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/appointments/new')
    })
  })
})
