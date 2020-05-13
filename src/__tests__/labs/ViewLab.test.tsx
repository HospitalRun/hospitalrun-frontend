// eslint-disable-next-line no-restricted-imports
import '../../__mocks__/matchMediaMock'

import { Badge, Button, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import format from 'date-fns/format'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import LabRepository from 'clients/db/LabRepository'
import PatientRepository from 'clients/db/PatientRepository'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import ViewLab from 'labs/ViewLab'
import Lab from 'model/Lab'
import Patient from 'model/Patient'
import Permissions from 'model/Permissions'
import * as ButtonBarProvider from 'page-header/ButtonBarProvider'
import * as titleUtil from 'page-header/useTitle'

const mockStore = createMockStore([thunk])

describe('View Labs', () => {
  let history: any
  const mockPatient = { fullName: 'test' }
  const mockLab = {
    code: 'L-1234',
    id: '12456',
    status: 'requested',
    patientId: '1234',
    type: 'lab type',
    notes: 'lab notes',
    requestedOn: '2020-03-30T04:43:20.102Z',
  } as Lab

  let setButtonToolBarSpy: any
  let titleSpy: any
  let labRepositorySaveSpy: any
  const expectedDate = new Date()
  const setup = async (lab: Lab, permissions: Permissions[], error = {}) => {
    jest.resetAllMocks()
    Date.now = jest.fn(() => expectedDate.valueOf())
    setButtonToolBarSpy = jest.fn()
    titleSpy = jest.spyOn(titleUtil, 'default')
    jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolBarSpy)
    jest.spyOn(LabRepository, 'find').mockResolvedValue(lab)
    labRepositorySaveSpy = jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(mockLab)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient as Patient)

    history = createMemoryHistory()
    history.push(`labs/${lab.id}`)
    const store = mockStore({
      title: '',
      user: {
        permissions,
      },
      lab: {
        lab,
        patient: mockPatient,
        error,
        status: Object.keys(error).length > 0 ? 'error' : 'completed',
      },
    })

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <Route path="/labs/:id">
                <ViewLab />
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
    await setup(mockLab, [Permissions.ViewLab])

    expect(titleSpy).toHaveBeenCalledWith(
      `${mockLab.type} for ${mockPatient.fullName}(${mockLab.code})`,
    )
  })

  describe('page content', () => {
    it('should display the patient full name for the for', async () => {
      const expectedLab = { ...mockLab } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const forPatientDiv = wrapper.find('.for-patient')
      expect(forPatientDiv.find('h4').text().trim()).toEqual('labs.lab.for')

      expect(forPatientDiv.find('h5').text().trim()).toEqual(mockPatient.fullName)
    })

    it('should display the lab type for type', async () => {
      const expectedLab = { ...mockLab, type: 'expected type' } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const labTypeDiv = wrapper.find('.lab-type')
      expect(labTypeDiv.find('h4').text().trim()).toEqual('labs.lab.type')

      expect(labTypeDiv.find('h5').text().trim()).toEqual(expectedLab.type)
    })

    it('should display the requested on date', async () => {
      const expectedLab = { ...mockLab, requestedOn: '2020-03-30T04:43:20.102Z' } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const requestedOnDiv = wrapper.find('.requested-on')
      expect(requestedOnDiv.find('h4').text().trim()).toEqual('labs.lab.requestedOn')

      expect(requestedOnDiv.find('h5').text().trim()).toEqual(
        format(new Date(expectedLab.requestedOn), 'yyyy-MM-dd hh:mm a'),
      )
    })

    it('should not display the completed date if the lab is not completed', async () => {
      const expectedLab = { ...mockLab } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const completedOnDiv = wrapper.find('.completed-on')

      expect(completedOnDiv).toHaveLength(0)
    })

    it('should not display the canceled date if the lab is not canceled', async () => {
      const expectedLab = { ...mockLab } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const completedOnDiv = wrapper.find('.canceled-on')

      expect(completedOnDiv).toHaveLength(0)
    })

    it('should render a result text field', async () => {
      const expectedLab = {
        ...mockLab,
        result: 'expected results',
      } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])

      const resultTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)

      expect(resultTextField).toBeDefined()
      expect(resultTextField.prop('label')).toEqual('labs.lab.result')
      expect(resultTextField.prop('value')).toEqual(expectedLab.result)
    })

    it('should display the notes in the notes text field', async () => {
      const expectedLab = { ...mockLab, notes: 'expected notes' } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup).at(1)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('labs.lab.notes')
      expect(notesTextField.prop('value')).toEqual(expectedLab.notes)
    })

    it('should display errors', async () => {
      const expectedLab = { ...mockLab, status: 'requested' } as Lab
      const expectedError = { message: 'some message', result: 'some result feedback' }
      const wrapper = await setup(expectedLab, [Permissions.ViewLab], expectedError)

      const alert = wrapper.find(Alert)
      const resultTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      expect(alert.prop('message')).toEqual(expectedError.message)
      expect(alert.prop('title')).toEqual('states.error')
      expect(alert.prop('color')).toEqual('danger')
      expect(resultTextField.prop('isInvalid')).toBeTruthy()
      expect(resultTextField.prop('feedback')).toEqual(expectedError.result)
    })

    describe('requested lab request', () => {
      it('should display a warning badge if the status is requested', async () => {
        const expectedLab = { ...mockLab, status: 'requested' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])
        const labStatusDiv = wrapper.find('.lab-status')
        const badge = labStatusDiv.find(Badge)
        expect(labStatusDiv.find('h4').text().trim()).toEqual('labs.lab.status')

        expect(badge.prop('color')).toEqual('warning')
        expect(badge.text().trim()).toEqual(expectedLab.status)
      })

      it('should display a update lab, complete lab, and cancel lab button if the lab is in a requested state', async () => {
        const expectedLab = { ...mockLab, notes: 'expected notes' } as Lab

        const wrapper = await setup(expectedLab, [
          Permissions.ViewLab,
          Permissions.CompleteLab,
          Permissions.CancelLab,
        ])

        const buttons = wrapper.find(Button)
        expect(buttons.at(0).text().trim()).toEqual('actions.update')

        expect(buttons.at(1).text().trim()).toEqual('labs.requests.complete')

        expect(buttons.at(2).text().trim()).toEqual('labs.requests.cancel')
      })
    })

    describe('canceled lab request', () => {
      it('should display a danger badge if the status is canceled', async () => {
        const expectedLab = { ...mockLab, status: 'canceled' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])

        const labStatusDiv = wrapper.find('.lab-status')
        const badge = labStatusDiv.find(Badge)
        expect(labStatusDiv.find('h4').text().trim()).toEqual('labs.lab.status')

        expect(badge.prop('color')).toEqual('danger')
        expect(badge.text().trim()).toEqual(expectedLab.status)
      })

      it('should display the canceled on date if the lab request has been canceled', async () => {
        const expectedLab = {
          ...mockLab,
          status: 'canceled',
          canceledOn: '2020-03-30T04:45:20.102Z',
        } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])
        const canceledOnDiv = wrapper.find('.canceled-on')

        expect(canceledOnDiv.find('h4').text().trim()).toEqual('labs.lab.canceledOn')

        expect(canceledOnDiv.find('h5').text().trim()).toEqual(
          format(new Date(expectedLab.canceledOn as string), 'yyyy-MM-dd hh:mm a'),
        )
      })

      it('should not display update, complete, and cancel button if the lab is canceled', async () => {
        const expectedLab = { ...mockLab, status: 'canceled' } as Lab

        const wrapper = await setup(expectedLab, [
          Permissions.ViewLab,
          Permissions.CompleteLab,
          Permissions.CancelLab,
        ])

        const buttons = wrapper.find(Button)
        expect(buttons).toHaveLength(0)
      })

      it('should not display an update button if the lab is canceled', async () => {
        const expectedLab = { ...mockLab, status: 'canceled' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])

        const updateButton = wrapper.find(Button)
        expect(updateButton).toHaveLength(0)
      })
    })

    describe('completed lab request', () => {
      it('should display a primary badge if the status is completed', async () => {
        jest.resetAllMocks()
        const expectedLab = { ...mockLab, status: 'completed' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])
        const labStatusDiv = wrapper.find('.lab-status')
        const badge = labStatusDiv.find(Badge)
        expect(labStatusDiv.find('h4').text().trim()).toEqual('labs.lab.status')

        expect(badge.prop('color')).toEqual('primary')
        expect(badge.text().trim()).toEqual(expectedLab.status)
      })

      it('should display the completed on date if the lab request has been completed', async () => {
        const expectedLab = {
          ...mockLab,
          status: 'completed',
          completedOn: '2020-03-30T04:44:20.102Z',
        } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])
        const completedOnDiv = wrapper.find('.completed-on')

        expect(completedOnDiv.find('h4').text().trim()).toEqual('labs.lab.completedOn')

        expect(completedOnDiv.find('h5').text().trim()).toEqual(
          format(new Date(expectedLab.completedOn as string), 'yyyy-MM-dd hh:mm a'),
        )
      })

      it('should not display update, complete, and cancel buttons if the lab is completed', async () => {
        const expectedLab = { ...mockLab, status: 'completed' } as Lab

        const wrapper = await setup(expectedLab, [
          Permissions.ViewLab,
          Permissions.CompleteLab,
          Permissions.CancelLab,
        ])

        const buttons = wrapper.find(Button)
        expect(buttons).toHaveLength(0)
      })
    })
  })

  describe('on update', () => {
    it('should update the lab with the new information', async () => {
      const wrapper = await setup(mockLab, [Permissions.ViewLab])
      const expectedResult = 'expected result'
      const expectedNotes = 'expected notes'

      const resultTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      act(() => {
        const onChange = resultTextField.prop('onChange')
        onChange({ currentTarget: { value: expectedResult } })
      })
      wrapper.update()

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup).at(1)
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

      expect(labRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(labRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ ...mockLab, result: expectedResult, notes: expectedNotes }),
      )
      expect(history.location.pathname).toEqual('/labs')
    })
  })

  describe('on complete', () => {
    it('should mark the status as completed and fill in the completed date with the current time', async () => {
      const wrapper = await setup(mockLab, [
        Permissions.ViewLab,
        Permissions.CompleteLab,
        Permissions.CancelLab,
      ])
      const expectedResult = 'expected result'

      const resultTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      await act(async () => {
        const onChange = resultTextField.prop('onChange')
        await onChange({ currentTarget: { value: expectedResult } })
      })
      wrapper.update()

      const completeButton = wrapper.find(Button).at(1)
      await act(async () => {
        const onClick = completeButton.prop('onClick')
        await onClick()
      })
      wrapper.update()

      expect(labRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(labRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockLab,
          result: expectedResult,
          status: 'completed',
          completedOn: expectedDate.toISOString(),
        }),
      )
      expect(history.location.pathname).toEqual('/labs')
    })
  })

  describe('on cancel', () => {
    it('should mark the status as canceled and fill in the cancelled on date with the current time', async () => {
      const wrapper = await setup(mockLab, [
        Permissions.ViewLab,
        Permissions.CompleteLab,
        Permissions.CancelLab,
      ])
      const expectedResult = 'expected result'

      const resultTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      await act(async () => {
        const onChange = resultTextField.prop('onChange')
        await onChange({ currentTarget: { value: expectedResult } })
      })
      wrapper.update()

      const cancelButton = wrapper.find(Button).at(2)
      await act(async () => {
        const onClick = cancelButton.prop('onClick')
        await onClick()
      })
      wrapper.update()

      expect(labRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(labRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockLab,
          result: expectedResult,
          status: 'canceled',
          canceledOn: expectedDate.toISOString(),
        }),
      )
      expect(history.location.pathname).toEqual('/labs')
    })
  })
})
