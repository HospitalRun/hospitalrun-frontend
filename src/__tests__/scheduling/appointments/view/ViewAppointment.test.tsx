import '../../../../__mocks__/matchMediaMock'
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import Appointment from 'model/Appointment'
import ViewAppointment from 'scheduling/appointments/view/ViewAppointment'
import { Router, Route } from 'react-router'
import { createMemoryHistory } from 'history'
import AppointmentRepository from 'clients/db/AppointmentRepository'
import { mocked } from 'ts-jest/utils'
import { act } from 'react-dom/test-utils'
import * as components from '@hospitalrun/components'
import AppointmentDetailForm from 'scheduling/appointments/AppointmentDetailForm'
import PatientRepository from 'clients/db/PatientRepository'
import Patient from 'model/Patient'
import * as ButtonBarProvider from 'page-header/ButtonBarProvider'
import Permissions from 'model/Permissions'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentSlice from '../../../../scheduling/appointments/appointment-slice'

const mockStore = configureMockStore([thunk])

const appointment = {
  id: '123',
  startDateTime: new Date().toISOString(),
  endDateTime: new Date().toISOString(),
  reason: 'reason',
  location: 'location',
} as Appointment

const patient = {
  id: '123',
  fullName: 'full name',
} as Patient

describe('View Appointment', () => {
  let history: any
  let store: MockStore

  const setup = (isLoading: boolean, permissions = [Permissions.ReadAppointments]) => {
    jest.spyOn(AppointmentRepository, 'find')
    jest.spyOn(AppointmentRepository, 'delete')
    const mockedAppointmentRepository = mocked(AppointmentRepository, true)
    mockedAppointmentRepository.find.mockResolvedValue(appointment)
    mockedAppointmentRepository.delete.mockResolvedValue(appointment)

    jest.spyOn(PatientRepository, 'find')
    const mockedPatientRepository = mocked(PatientRepository, true)
    mockedPatientRepository.find.mockResolvedValue(patient)

    history = createMemoryHistory()
    history.push('/appointments/123')

    store = mockStore({
      user: {
        permissions,
      },
      appointment: {
        appointment,
        isLoading,
        patient,
      },
    })

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/appointments/:id">
            <ViewAppointment />
          </Route>
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should use the correct title', async () => {
    jest.spyOn(titleUtil, 'default')
    await act(async () => {
      await setup(true)
    })

    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.viewAppointment')
  })

  it('should add a "Edit Appointment" button to the button tool bar if has WriteAppointment permissions', () => {
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
    const setButtonToolBarSpy = jest.fn()
    mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

    setup(true, [Permissions.WriteAppointments, Permissions.ReadAppointments])

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect((actualButtons[0] as any).props.children).toEqual('actions.edit')
  })

  it('should add a "Delete Appointment" button to the button tool bar if has DeleteAppointment permissions', () => {
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
    const setButtonToolBarSpy = jest.fn()
    mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

    setup(true, [Permissions.DeleteAppointment, Permissions.ReadAppointments])

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect((actualButtons[0] as any).props.children).toEqual(
      'scheduling.appointments.deleteAppointment',
    )
  })

  it('button toolbar empty if has only ReadAppointments permission', () => {
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
    const setButtonToolBarSpy = jest.fn()
    mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

    setup(true)

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect(actualButtons.length).toEqual(0)
  })

  it('should dispatch getAppointment if id is present', async () => {
    await act(async () => {
      await setup(true)
    })

    expect(AppointmentRepository.find).toHaveBeenCalledWith(appointment.id)
    expect(store.getActions()).toContainEqual(appointmentSlice.fetchAppointmentStart())
    expect(store.getActions()).toContainEqual(
      appointmentSlice.fetchAppointmentSuccess({ appointment, patient }),
    )
  })

  it('should render a loading spinner', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup(true)
    })

    expect(wrapper.find(components.Spinner)).toHaveLength(1)
  })

  it('should render a AppointmentDetailForm with the correct data', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup(false)
    })

    const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
    expect(appointmentDetailForm.prop('appointment')).toEqual(appointment)
    expect(appointmentDetailForm.prop('isEditable')).toBeFalsy()
  })

  it('should render a modal for delete confirmation', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await setup(false)
    })

    const deleteAppointmentConfirmationModal = wrapper.find(components.Modal)
    expect(deleteAppointmentConfirmationModal).toHaveLength(1)
    expect(deleteAppointmentConfirmationModal.prop('closeButton').children).toEqual(
      'actions.delete',
    )
    expect(deleteAppointmentConfirmationModal.prop('body')).toEqual(
      'scheduling.appointment.deleteConfirmationMessage',
    )
    expect(deleteAppointmentConfirmationModal.prop('title')).toEqual('actions.confirmDelete')
  })

  describe('delete appointment', () => {
    let setButtonToolBarSpy = jest.fn()
    let deleteAppointmentSpy = jest.spyOn(AppointmentRepository, 'delete')
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
      deleteAppointmentSpy = jest.spyOn(AppointmentRepository, 'delete')
      setButtonToolBarSpy = jest.fn()
      mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)
    })

    it('should render a delete appointment button in the button toolbar', async () => {
      await act(async () => {
        await setup(false, [Permissions.ReadAppointments, Permissions.DeleteAppointment])
      })

      expect(setButtonToolBarSpy).toHaveBeenCalledTimes(1)
      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual(
        'scheduling.appointments.deleteAppointment',
      )
    })

    it('should pop up the modal when on delete appointment click', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup(false, [Permissions.ReadAppointments, Permissions.DeleteAppointment])
      })

      expect(setButtonToolBarSpy).toHaveBeenCalledTimes(1)
      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]

      act(() => {
        const { onClick } = (actualButtons[0] as any).props
        onClick({ preventDefault: jest.fn() })
      })
      wrapper.update()

      const deleteConfirmationModal = wrapper.find(components.Modal)
      expect(deleteConfirmationModal.prop('show')).toEqual(true)
    })

    it('should close the modal when the toggle button is clicked', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup(false, [Permissions.ReadAppointments, Permissions.DeleteAppointment])
      })

      expect(setButtonToolBarSpy).toHaveBeenCalledTimes(1)
      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]

      act(() => {
        const { onClick } = (actualButtons[0] as any).props
        onClick({ preventDefault: jest.fn() })
      })
      wrapper.update()

      act(() => {
        const deleteConfirmationModal = wrapper.find(components.Modal)
        deleteConfirmationModal.prop('toggle')()
      })
      wrapper.update()

      const deleteConfirmationModal = wrapper.find(components.Modal)
      expect(deleteConfirmationModal.prop('show')).toEqual(false)
    })

    it('should dispatch DELETE_APPOINTMENT action when modal confirmation button is clicked', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = await setup(false, [Permissions.ReadAppointments, Permissions.DeleteAppointment])
      })

      const deleteConfirmationModal = wrapper.find(components.Modal)

      await act(async () => {
        await deleteConfirmationModal.prop('closeButton').onClick()
      })
      wrapper.update()

      expect(deleteAppointmentSpy).toHaveBeenCalledTimes(1)
      expect(deleteAppointmentSpy).toHaveBeenCalledWith(appointment)

      expect(store.getActions()).toContainEqual(appointmentSlice.deleteAppointmentStart())
      expect(store.getActions()).toContainEqual(appointmentSlice.deleteAppointmentSuccess())
    })

    it('should navigate to /appointments and display a message when delete is successful', async () => {
      jest.spyOn(components, 'Toast')
      const mockedComponents = mocked(components, true)

      let wrapper: any
      await act(async () => {
        wrapper = await setup(false, [Permissions.ReadAppointments, Permissions.DeleteAppointment])
      })

      const deleteConfirmationModal = wrapper.find(components.Modal)

      await act(async () => {
        await deleteConfirmationModal.prop('closeButton').onClick()
      })
      wrapper.update()

      expect(history.location.pathname).toEqual('/appointments')
      expect(mockedComponents.Toast).toHaveBeenCalledWith(
        'success',
        'states.success',
        'scheduling.appointment.successfullyDeleted',
      )
    })
  })
})
