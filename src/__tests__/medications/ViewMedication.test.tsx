import { Badge, Button } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import format from 'date-fns/format'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewMedication from '../../medications/ViewMedication'
import * as ButtonBarProvider from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/useTitle'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import MedicationRepository from '../../shared/db/MedicationRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Medication from '../../shared/model/Medication'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Medication', () => {
  let history: any
  const mockPatient = { fullName: 'test' }
  const mockMedication = {
    id: '12456',
    status: 'draft',
    patient: '1234',
    medication: 'medication',
    intent: 'order',
    priority: 'routine',
    quantity: { value: 1, unit: 'unit' },
    notes: 'medication notes',
    requestedOn: '2020-03-30T04:43:20.102Z',
  } as Medication

  let setButtonToolBarSpy: any
  let titleSpy: any
  let medicationRepositorySaveSpy: any
  const expectedDate = new Date()
  const setup = async (medication: Medication, permissions: Permissions[], error = {}) => {
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedDate.valueOf())
    setButtonToolBarSpy = jest.fn()
    titleSpy = jest.spyOn(titleUtil, 'default')
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(MedicationRepository, 'find').mockResolvedValue(medication)
    medicationRepositorySaveSpy = jest
      .spyOn(MedicationRepository, 'saveOrUpdate')
      .mockResolvedValue(mockMedication)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient as Patient)

    history = createMemoryHistory()
    history.push(`medications/${medication.id}`)
    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
      medication: {
        medication,
        patient: mockPatient,
        error,
        status: Object.keys(error).length > 0 ? 'error' : 'completed',
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/medications/:id">
                <ViewMedication />
              </Route>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })
    wrapper.update()
    return wrapper
  }

  it('should set the title', async () => {
    await setup(mockMedication, [Permissions.ViewMedication])

    expect(titleSpy).toHaveBeenCalledWith(
      `${mockMedication.medication} for ${mockPatient.fullName}`,
    )
  })

  describe('page content', () => {
    it('should display the patient full name for the for', async () => {
      const expectedMedication = { ...mockMedication } as Medication
      const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
      const forPatientDiv = wrapper.find('.for-patient')
      expect(forPatientDiv.find('h4').text().trim()).toEqual('medications.medication.for')

      expect(forPatientDiv.find('h5').text().trim()).toEqual(mockPatient.fullName)
    })

    it('should display the medication ', async () => {
      const expectedMedication = {
        ...mockMedication,
        medication: 'expected medication',
      } as Medication
      const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
      const medicationTypeDiv = wrapper.find('.medication-medication')
      expect(medicationTypeDiv.find('h4').text().trim()).toEqual(
        'medications.medication.medication',
      )

      expect(medicationTypeDiv.find('h5').text().trim()).toEqual(expectedMedication.medication)
    })

    it('should display the requested on date', async () => {
      const expectedMedication = {
        ...mockMedication,
        requestedOn: '2020-03-30T04:43:20.102Z',
      } as Medication
      const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
      const requestedOnDiv = wrapper.find('.requested-on')
      expect(requestedOnDiv.find('h4').text().trim()).toEqual('medications.medication.requestedOn')

      expect(requestedOnDiv.find('h5').text().trim()).toEqual(
        format(new Date(expectedMedication.requestedOn), 'yyyy-MM-dd hh:mm a'),
      )
    })

    it('should not display the completed date if the medication is not completed', async () => {
      const expectedMedication = { ...mockMedication } as Medication
      const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
      const completedOnDiv = wrapper.find('.completed-on')

      expect(completedOnDiv).toHaveLength(0)
    })

    it('should not display the canceled date if the medication is not canceled', async () => {
      const expectedMedication = { ...mockMedication } as Medication
      const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
      const completedOnDiv = wrapper.find('.canceled-on')

      expect(completedOnDiv).toHaveLength(0)
    })

    it('should display the notes in the notes text field', async () => {
      const expectedMedication = { ...mockMedication, notes: 'expected notes' } as Medication
      const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)

      expect(notesTextField).toBeDefined()

      expect(notesTextField.prop('label')).toEqual('medications.medication.notes')
      expect(notesTextField.prop('value')).toEqual(expectedMedication.notes)
    })

    describe('draft medication request', () => {
      it('should display a warning badge if the status is draft', async () => {
        const expectedMedication = ({
          ...mockMedication,
          status: 'draft',
        } as unknown) as Medication
        const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
        const medicationStatusDiv = wrapper.find('.medication-status')
        const badge = medicationStatusDiv.find(Badge)
        expect(medicationStatusDiv.find('h4').text().trim()).toEqual(
          'medications.medication.status',
        )

        expect(badge.prop('color')).toEqual('warning')
        expect(badge.text().trim()).toEqual(expectedMedication.status)
      })

      it('should display a update medication, complete medication, and cancel medication button if the medication is in a draft state', async () => {
        const expectedMedication = { ...mockMedication, notes: 'expected notes' } as Medication

        const wrapper = await setup(expectedMedication, [
          Permissions.ViewMedication,
          Permissions.CompleteMedication,
          Permissions.CancelMedication,
        ])

        const buttons = wrapper.find(Button)
        expect(buttons.at(0).text().trim()).toEqual('actions.update')

        expect(buttons.at(1).text().trim()).toEqual('medications.requests.complete')

        expect(buttons.at(2).text().trim()).toEqual('medications.requests.cancel')
      })
    })

    describe('canceled medication request', () => {
      it('should display a danger badge if the status is canceled', async () => {
        const expectedMedication = { ...mockMedication, status: 'canceled' } as Medication
        const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])

        const medicationStatusDiv = wrapper.find('.medication-status')
        const badge = medicationStatusDiv.find(Badge)
        expect(medicationStatusDiv.find('h4').text().trim()).toEqual(
          'medications.medication.status',
        )

        expect(badge.prop('color')).toEqual('danger')
        expect(badge.text().trim()).toEqual(expectedMedication.status)
      })

      it('should display the canceled on date if the medication request has been canceled', async () => {
        const expectedMedication = {
          ...mockMedication,
          status: 'canceled',
          canceledOn: '2020-03-30T04:45:20.102Z',
        } as Medication
        const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
        const canceledOnDiv = wrapper.find('.canceled-on')

        expect(canceledOnDiv.find('h4').text().trim()).toEqual('medications.medication.canceledOn')

        expect(canceledOnDiv.find('h5').text().trim()).toEqual(
          format(new Date(expectedMedication.canceledOn as string), 'yyyy-MM-dd hh:mm a'),
        )
      })

      it('should not display update, complete, and cancel button if the medication is canceled', async () => {
        const expectedMedication = { ...mockMedication, status: 'canceled' } as Medication

        const wrapper = await setup(expectedMedication, [
          Permissions.ViewMedication,
          Permissions.CompleteMedication,
          Permissions.CancelMedication,
        ])

        const buttons = wrapper.find(Button)
        expect(buttons).toHaveLength(0)
      })

      it('should not display an update button if the medication is canceled', async () => {
        const expectedMedication = { ...mockMedication, status: 'canceled' } as Medication
        const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])

        const updateButton = wrapper.find(Button)
        expect(updateButton).toHaveLength(0)
      })
    })

    describe('completed medication request', () => {
      it('should display a primary badge if the status is completed', async () => {
        jest.resetAllMocks()
        const expectedMedication = { ...mockMedication, status: 'completed' } as Medication
        const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
        const medicationStatusDiv = wrapper.find('.medication-status')
        const badge = medicationStatusDiv.find(Badge)
        expect(medicationStatusDiv.find('h4').text().trim()).toEqual(
          'medications.medication.status',
        )

        expect(badge.prop('color')).toEqual('primary')
        expect(badge.text().trim()).toEqual(expectedMedication.status)
      })

      it('should display the completed on date if the medication request has been completed', async () => {
        const expectedMedication = {
          ...mockMedication,
          status: 'completed',
          completedOn: '2020-03-30T04:44:20.102Z',
        } as Medication
        const wrapper = await setup(expectedMedication, [Permissions.ViewMedication])
        const completedOnDiv = wrapper.find('.completed-on')

        expect(completedOnDiv.find('h4').text().trim()).toEqual(
          'medications.medication.completedOn',
        )

        expect(completedOnDiv.find('h5').text().trim()).toEqual(
          format(new Date(expectedMedication.completedOn as string), 'yyyy-MM-dd hh:mm a'),
        )
      })

      it('should not display update, complete, and cancel buttons if the medication is completed', async () => {
        const expectedMedication = { ...mockMedication, status: 'completed' } as Medication

        const wrapper = await setup(expectedMedication, [
          Permissions.ViewMedication,
          Permissions.CompleteMedication,
          Permissions.CancelMedication,
        ])

        const buttons = wrapper.find(Button)
        expect(buttons).toHaveLength(0)
      })
    })
  })

  describe('on update', () => {
    it('should update the medication with the new information', async () => {
      const wrapper = await setup(mockMedication, [Permissions.ViewMedication])
      const expectedNotes = 'expected notes'

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      act(() => {
        const onChange = notesTextField.prop('onChange')
        onChange({ currentTarget: { value: expectedNotes } })
      })
      wrapper.update()
      const updateButton = wrapper.find(Button)
      await act(async () => {
        const onClick = updateButton.prop('onClick')
        onClick()
      })

      expect(medicationRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(medicationRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockMedication,
          notes: expectedNotes,
        }),
      )
      expect(history.location.pathname).toEqual('/medications')
    })
  })

  describe('on complete', () => {
    it('should mark the status as completed and fill in the completed date with the current time', async () => {
      const wrapper = await setup(mockMedication, [
        Permissions.ViewMedication,
        Permissions.CompleteMedication,
        Permissions.CancelMedication,
      ])

      const completeButton = wrapper.find(Button).at(1)
      await act(async () => {
        const onClick = completeButton.prop('onClick')
        await onClick()
      })
      wrapper.update()

      expect(medicationRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(medicationRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockMedication,
          status: 'completed',
          completedOn: expectedDate.toISOString(),
        }),
      )
      expect(history.location.pathname).toEqual('/medications')
    })
  })

  describe('on cancel', () => {
    it('should mark the status as canceled and fill in the cancelled on date with the current time', async () => {
      const wrapper = await setup(mockMedication, [
        Permissions.ViewMedication,
        Permissions.CompleteMedication,
        Permissions.CancelMedication,
      ])

      const cancelButton = wrapper.find(Button).at(2)
      await act(async () => {
        const onClick = cancelButton.prop('onClick')
        await onClick()
      })
      wrapper.update()

      expect(medicationRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(medicationRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockMedication,
          status: 'canceled',
          canceledOn: expectedDate.toISOString(),
        }),
      )
      expect(history.location.pathname).toEqual('/medications')
    })
  })
})
