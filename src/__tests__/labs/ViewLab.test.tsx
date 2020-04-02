import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { mount } from 'enzyme'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import Permissions from 'model/Permissions'
import { act } from '@testing-library/react'
import LabRepository from 'clients/db/LabRepository'
import PatientRepository from 'clients/db/PatientRepository'
import Lab from 'model/Lab'
import Patient from 'model/Patient'
import * as ButtonBarProvider from 'page-header/ButtonBarProvider'
import createMockStore from 'redux-mock-store'
import { Badge, Button } from '@hospitalrun/components'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import ButtonToolBar from 'page-header/ButtonToolBar'
import * as titleUtil from '../../page-header/useTitle'
import ViewLab from '../../labs/ViewLab'

const mockStore = createMockStore([thunk])

describe('View Labs', () => {
  let history: any
  const mockPatient = { fullName: 'test' }
  const mockLab = {
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
  const setup = async (lab: Lab, permissions: Permissions[]) => {
    jest.resetAllMocks()
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

    expect(titleSpy).toHaveBeenCalledWith(`${mockLab.type} for ${mockPatient.fullName}`)
  })

  describe('page content', () => {
    it('should display the patient full name for the for', async () => {
      const expectedLab = { ...mockLab } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const forPatientDiv = wrapper.find('.for-patient')
      expect(
        forPatientDiv
          .find('h4')
          .text()
          .trim(),
      ).toEqual('labs.lab.for')

      expect(
        forPatientDiv
          .find('h5')
          .text()
          .trim(),
      ).toEqual(mockPatient.fullName)
    })

    it('should display the lab type for type', async () => {
      const expectedLab = { ...mockLab, type: 'expected type' } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const labTypeDiv = wrapper.find('.lab-type')
      expect(
        labTypeDiv
          .find('h4')
          .text()
          .trim(),
      ).toEqual('labs.lab.type')

      expect(
        labTypeDiv
          .find('h5')
          .text()
          .trim(),
      ).toEqual(expectedLab.type)
    })

    it('should display the requested on date', async () => {
      const expectedLab = { ...mockLab, requestedOn: '2020-03-30T04:43:20.102Z' } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])
      const requestedOnDiv = wrapper.find('.requested-on')
      expect(
        requestedOnDiv
          .find('h4')
          .text()
          .trim(),
      ).toEqual('labs.lab.requestedOn')

      expect(
        requestedOnDiv
          .find('h5')
          .text()
          .trim(),
      ).toEqual('2020-03-29 11:43 PM')
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

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup).at(0)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('labs.lab.result')
      expect(notesTextField.prop('value')).toEqual(expectedLab.result)
    })

    it('should display the notes in the notes text field', async () => {
      const expectedLab = { ...mockLab, notes: 'expected notes' } as Lab
      const wrapper = await setup(expectedLab, [Permissions.ViewLab])

      const notesTextField = wrapper.find(TextFieldWithLabelFormGroup).at(1)

      expect(notesTextField).toBeDefined()
      expect(notesTextField.prop('label')).toEqual('labs.lab.notes')
      expect(notesTextField.prop('value')).toEqual(expectedLab.notes)
    })

    it('should display an update button if the lab is in a requested state', async () => {})

    describe('requested lab request', () => {
      it('should display a warning badge if the status is requested', async () => {
        const expectedLab = { ...mockLab, status: 'requested' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])
        const labStatusDiv = wrapper.find('.lab-status')
        const badge = labStatusDiv.find(Badge)
        expect(
          labStatusDiv
            .find('h4')
            .text()
            .trim(),
        ).toEqual('labs.lab.status')

        expect(badge.prop('color')).toEqual('warning')
        expect(badge.text().trim()).toEqual(expectedLab.status)
      })

      it('should display a complete lab and cancel lab button if the lab is in a requested state', async () => {
        const expectedLab = { ...mockLab, notes: 'expected notes' } as Lab

        setup(expectedLab, [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab])

        const actualButtons: React.ReactNode[] = setButtonToolBarSpy.mock.calls[0][0]
        expect((actualButtons[0] as any).props.children).toEqual('labs.requests.complete')
        expect((actualButtons[1] as any).props.children).toEqual('labs.requests.cancel')
      })
    })

    describe('canceled lab request', () => {
      it('should display a danger badge if the status is canceled', async () => {
        const expectedLab = { ...mockLab, status: 'canceled' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])

        const labStatusDiv = wrapper.find('.lab-status')
        const badge = labStatusDiv.find(Badge)
        expect(
          labStatusDiv
            .find('h4')
            .text()
            .trim(),
        ).toEqual('labs.lab.status')

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

        expect(
          canceledOnDiv
            .find('h4')
            .text()
            .trim(),
        ).toEqual('labs.lab.canceledOn')

        expect(
          canceledOnDiv
            .find('h5')
            .text()
            .trim(),
        ).toEqual('2020-03-29 11:45 PM')
      })

      it('should not display complete and cancel button if the lab is canceled', async () => {
        const expectedLab = { ...mockLab, status: 'canceled' } as Lab

        await setup(expectedLab, [
          Permissions.ViewLab,
          Permissions.CompleteLab,
          Permissions.CancelLab,
        ])

        const { calls } = setButtonToolBarSpy.mock
        const actualButtons: React.ReactNode[] = calls[calls.length - 1][0]
        expect(actualButtons as any).toEqual([])
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
        expect(
          labStatusDiv
            .find('h4')
            .text()
            .trim(),
        ).toEqual('labs.lab.status')

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

        expect(
          completedOnDiv
            .find('h4')
            .text()
            .trim(),
        ).toEqual('labs.lab.completedOn')

        expect(
          completedOnDiv
            .find('h5')
            .text()
            .trim(),
        ).toEqual('2020-03-29 11:44 PM')
      })

      it('should not display complete and cancel button if the lab is completed', async () => {
        const expectedLab = { ...mockLab, status: 'completed' } as Lab

        await setup(expectedLab, [
          Permissions.ViewLab,
          Permissions.CompleteLab,
          Permissions.CancelLab,
        ])

        const { calls } = setButtonToolBarSpy.mock
        const actualButtons: React.ReactNode[] = calls[calls.length - 1][0]
        expect(actualButtons as any).toEqual([])
      })

      it('should not display an update button if the lab is completed', async () => {
        const expectedLab = { ...mockLab, status: 'canceled' } as Lab
        const wrapper = await setup(expectedLab, [Permissions.ViewLab])

        const updateButton = wrapper.find(Button)
        expect(updateButton).toHaveLength(0)
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

      const completeButton = setButtonToolBarSpy.mock.calls[0][0][0]
      await act(async () => {
        const { onClick } = completeButton.props
        await onClick()
      })
      wrapper.update()

      expect(labRepositorySaveSpy).toHaveBeenCalledTimes(1)
      expect(labRepositorySaveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ ...mockLab, result: expectedResult }),
      )
      expect(history.location.pathname).toEqual('/labs')
    })

    it('should validate that the result has been filled in', () => {})
  })

  describe('on cancel', () => {
    it('should mark the status as completed and fill in the cancelled on date with the current time', () => {})
  })
})
