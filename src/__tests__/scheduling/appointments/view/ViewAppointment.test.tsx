import '../../../../__mocks__/matchMediaMock'

import * as components from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'
import { mocked } from 'ts-jest/utils'

import AppointmentRepository from '../../../../clients/db/AppointmentRepository'
import PatientRepository from '../../../../clients/db/PatientRepository'
import Appointment from '../../../../model/Appointment'
import Patient from '../../../../model/Patient'
import Permissions from '../../../../model/Permissions'
import * as ButtonBarProvider from '../../../../page-header/ButtonBarProvider'
import * as titleUtil from '../../../../page-header/useTitle'
import * as appointmentSlice from '../../../../scheduling/appointments/appointment-slice'
import AppointmentDetailForm from '../../../../scheduling/appointments/AppointmentDetailForm'
import ViewAppointment from '../../../../scheduling/appointments/view/ViewAppointment'
import { RootState } from '../../../../store'

const mockStore = createMockStore<RootState, any>([thunk])

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

  const setup = async (status = 'completed', permissions = [Permissions.ReadAppointments]) => {
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(appointment)
    jest.spyOn(AppointmentRepository, 'delete').mockResolvedValue(appointment)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)

    history = createMemoryHistory()
    history.push('/appointments/123')

    store = mockStore({
      user: {
        permissions,
      },
      appointment: {
        appointment,
        status,
        patient,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/appointments/:id">
              <ViewAppointment />
            </Route>
          </Router>
        </Provider>,
      )
    })

    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should use the correct title', async () => {
    jest.spyOn(titleUtil, 'default')
    await setup()

    expect(titleUtil.default).toHaveBeenCalledWith('scheduling.appointments.viewAppointment')
  })

  it('should add a "Edit Appointment" button to the button tool bar if has WriteAppointment permissions', async () => {
    const setButtonToolBarSpy = jest.fn()
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    await setup('loading', [Permissions.WriteAppointments, Permissions.ReadAppointments])

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect((actualButtons[0] as any).props.children).toEqual('actions.edit')
  })

  it('should add a "Delete Appointment" button to the button tool bar if has DeleteAppointment permissions', async () => {
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter')
    const setButtonToolBarSpy = jest.fn()
    mocked(ButtonBarProvider).useButtonToolbarSetter.mockReturnValue(setButtonToolBarSpy)

    await setup('loading', [Permissions.DeleteAppointment, Permissions.ReadAppointments])

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect((actualButtons[0] as any).props.children).toEqual(
      'scheduling.appointments.deleteAppointment',
    )
  })

  it('button toolbar empty if has only ReadAppointments permission', async () => {
    const setButtonToolBarSpy = jest.fn()
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)

    await setup('loading')

    const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
    expect(actualButtons.length).toEqual(0)
  })

  it('should dispatch getAppointment if id is present', async () => {
    await setup()

    expect(AppointmentRepository.find).toHaveBeenCalledWith(appointment.id)
    expect(store.getActions()).toContainEqual(appointmentSlice.fetchAppointmentStart())
    expect(store.getActions()).toContainEqual(
      appointmentSlice.fetchAppointmentSuccess({ appointment, patient }),
    )
  })

  it('should render a loading spinner', async () => {
    const { wrapper } = await setup('loading')

    expect(wrapper.find(components.Spinner)).toHaveLength(1)
  })

  it('should render a AppointmentDetailForm with the correct data', async () => {
    const { wrapper } = await setup()

    const appointmentDetailForm = wrapper.find(AppointmentDetailForm)
    expect(appointmentDetailForm.prop('appointment')).toEqual(appointment)
    expect(appointmentDetailForm.prop('isEditable')).toBeFalsy()
  })

  it('should render a modal for delete confirmation', async () => {
    const { wrapper } = await setup()

    const deleteAppointmentConfirmationModal = wrapper.find(components.Modal)
    expect(deleteAppointmentConfirmationModal).toHaveLength(1)
    expect(deleteAppointmentConfirmationModal.prop('closeButton')?.children).toEqual(
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
      await setup('completed', [Permissions.ReadAppointments, Permissions.DeleteAppointment])

      expect(setButtonToolBarSpy).toHaveBeenCalledTimes(1)
      const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual(
        'scheduling.appointments.deleteAppointment',
      )
    })

    it('should pop up the modal when on delete appointment click', async () => {
      const { wrapper } = await setup('completed', [
        Permissions.ReadAppointments,
        Permissions.DeleteAppointment,
      ])

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
      const { wrapper } = await setup('completed', [
        Permissions.ReadAppointments,
        Permissions.DeleteAppointment,
      ])

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
      const { wrapper } = await setup('completed', [
        Permissions.ReadAppointments,
        Permissions.DeleteAppointment,
      ])

      const deleteConfirmationModal = wrapper.find(components.Modal)

      await act(async () => {
        const closeButton = (await deleteConfirmationModal.prop('closeButton')) as any
        closeButton.onClick()
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

      const { wrapper } = await setup('completed', [
        Permissions.ReadAppointments,
        Permissions.DeleteAppointment,
      ])

      const deleteConfirmationModal = wrapper.find(components.Modal)

      await act(async () => {
        const closeButton = (await deleteConfirmationModal.prop('closeButton')) as any
        closeButton.onClick()
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
