import {
  render as rtlRender,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as validateUtil from '../../labs/utils/validate-lab'
import { LabError } from '../../labs/utils/validate-lab'
import ViewLab from '../../labs/ViewLab'
import { ButtonBarProvider } from '../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../page-header/title/TitleContext'
import LabRepository from '../../shared/db/LabRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import { expectOneConsoleError } from '../test-utils/console.utils'

const mockStore = createMockStore<RootState, any>([thunk])

type WrapperProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

const render = (permissions: Permissions[], lab?: Partial<Lab>, error = {}) => {
  const expectedDate = new Date()
  const mockPatient = { fullName: 'test' }
  const mockLab = {
    ...{
      code: 'L-1234',
      id: '12456',
      status: 'requested',
      patient: '1234',
      type: 'lab type',
      notes: [],
      requestedOn: '2020-03-30T04:43:20.102Z',
    },
    ...lab,
  } as Lab

  jest.resetAllMocks()
  Date.now = jest.fn(() => expectedDate.valueOf())
  jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient as Patient)
  jest.spyOn(LabRepository, 'saveOrUpdate').mockResolvedValue(mockLab)
  jest.spyOn(LabRepository, 'find').mockResolvedValue(mockLab)

  const history = createMemoryHistory({ initialEntries: [`/labs/${mockLab.id}`] })
  const store = mockStore({
    user: {
      permissions,
    },
    lab: {
      mockLab,
      patient: mockPatient,
      error,
      status: Object.keys(error).length > 0 ? 'error' : 'completed',
    },
  } as any)

  const Wrapper = ({ children }: WrapperProps) => (
    <ButtonBarProvider>
      <Provider store={store}>
        <Router history={history}>
          <Route path="/labs/:id">
            <titleUtil.TitleProvider>{children}</titleUtil.TitleProvider>
          </Route>
        </Router>
      </Provider>
    </ButtonBarProvider>
  )

  const utils = rtlRender(<ViewLab />, { wrapper: Wrapper })

  return {
    history,
    store,
    expectedDate,
    expectedLab: mockLab,
    expectedPatient: mockPatient,
    ...utils,
  }
}

describe('View Lab', () => {
  describe('page content', () => {
    it("should display the patients' full name", async () => {
      const { expectedPatient } = render([Permissions.ViewLab])

      await waitFor(() => {
        expect(screen.getByText('labs.lab.for')).toBeInTheDocument()
        expect(screen.getByText(expectedPatient.fullName)).toBeInTheDocument()
      })
    })

    it('should display the lab-type', async () => {
      const { expectedLab } = render([Permissions.ViewLab], { type: 'expected type' })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /labs.lab.type/i })).toBeInTheDocument()
        expect(screen.getByText(expectedLab.type)).toBeInTheDocument()
      })
    })

    it('should display the requested on date', async () => {
      const { expectedLab } = render([Permissions.ViewLab], {
        requestedOn: '2020-03-30T04:43:20.102Z',
      })

      await waitFor(() => {
        expect(screen.getByText('labs.lab.requestedOn')).toBeInTheDocument()
      })
      expect(
        screen.getByText(format(new Date(expectedLab.requestedOn), 'yyyy-MM-dd hh:mm a')),
      ).toBeInTheDocument()
    })

    it('should not display the completed date if the lab is not completed', async () => {
      const completedDate = new Date('2020-10-10T10:10:10.100') // We want a different date than the mocked date
      render([Permissions.ViewLab], { completedOn: completedDate.toISOString() })

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

      expect(
        screen.queryByText(format(completedDate, 'yyyy-MM-dd HH:mm a')),
      ).not.toBeInTheDocument()
    })

    it('should not display the canceled date if the lab is not canceled', async () => {
      const cancelledDate = new Date('2020-10-10T10:10:10.100') // We want a different date than the mocked date
      render([Permissions.ViewLab], { canceledOn: cancelledDate.toISOString() })

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

      expect(
        screen.queryByText(format(cancelledDate, 'yyyy-MM-dd HH:mm a')),
      ).not.toBeInTheDocument()
    })

    it('should render a result text field', async () => {
      const { expectedLab } = render([Permissions.ViewLab], { result: 'expected results' })

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', {
            name: /labs\.lab\.result/i,
          }),
        ).toHaveValue(expectedLab.result)
      })
    })

    it('should not display past notes if there is not', () => {
      const { container } = render([Permissions.ViewLab], { notes: [] })

      expect(container.querySelector('.callout')).not.toBeInTheDocument()
    })

    it('should display the past notes', async () => {
      const expectedNotes = 'expected notes'
      const { container } = render([Permissions.ViewLab], { notes: [expectedNotes] })

      await waitFor(() => {
        expect(screen.getByText(expectedNotes)).toBeInTheDocument()
      })
      expect(container.querySelector('.callout')).toBeInTheDocument()
    })

    it('should display the notes text field empty', async () => {
      render([Permissions.ViewLab])

      await waitFor(() => {
        expect(screen.getByLabelText('labs.lab.notes')).toHaveValue('')
      })
    })

    it('should display errors', async () => {
      render([Permissions.ViewLab, Permissions.CompleteLab], { status: 'requested' })

      const expectedError = { message: 'some message', result: 'some result feedback' } as LabError
      expectOneConsoleError(expectedError)
      jest.spyOn(validateUtil, 'validateLabComplete').mockReturnValue(expectedError)

      await waitFor(() => {
        userEvent.click(
          screen.getByRole('button', {
            name: /labs\.requests\.complete/i,
          }),
        )
      })

      const alert = await screen.findByRole('alert')

      expect(alert).toContainElement(screen.getByText(/states\.error/i))
      expect(alert).toContainElement(screen.getByText(/some message/i))

      expect(screen.getByLabelText(/labs\.lab\.result/i)).toHaveClass('is-invalid')
    })

    describe('requested lab request', () => {
      it('should display a warning badge if the status is requested', async () => {
        const { expectedLab } = render([Permissions.ViewLab], { status: 'requested' })

        await waitFor(() => {
          expect(
            screen.getByRole('heading', {
              name: /labs\.lab\.status/i,
            }),
          ).toBeInTheDocument()
          expect(screen.getByText(expectedLab.status)).toBeInTheDocument()
        })
      })

      it('should display a update lab, complete lab, and cancel lab button if the lab is in a requested state', async () => {
        render([Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab])

        await waitFor(() => {
          screen.getByRole('button', {
            name: /labs\.requests\.update/i,
          })
          screen.getByRole('button', {
            name: /labs\.requests\.complete/i,
          })
          screen.getByRole('button', {
            name: /labs\.requests\.cancel/i,
          })
        })
      })
    })

    describe('canceled lab request', () => {
      it('should display a danger badge if the status is canceled', async () => {
        render([Permissions.ViewLab], { status: 'canceled' })

        await waitFor(() => {
          expect(
            screen.getByRole('heading', {
              name: /labs\.lab\.status/i,
            }),
          ).toBeInTheDocument()
          expect(
            screen.getByRole('heading', {
              name: /canceled/i,
            }),
          ).toBeInTheDocument()
        })
      })

      it('should display the canceled on date if the lab request has been canceled', async () => {
        const { expectedLab } = render([Permissions.ViewLab], {
          status: 'canceled',
          canceledOn: '2020-03-30T04:45:20.102Z',
        })

        await waitFor(() => {
          expect(
            screen.getByRole('heading', {
              name: /labs\.lab\.canceledon/i,
            }),
          ).toBeInTheDocument()
          expect(
            screen.getByRole('heading', {
              name: format(new Date(expectedLab.canceledOn as string), 'yyyy-MM-dd hh:mm a'),
            }),
          ).toBeInTheDocument()
        })
      })

      it('should not display update, complete, and cancel button if the lab is canceled', async () => {
        render([Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab], {
          status: 'canceled',
        })

        await waitFor(() => {
          expect(screen.queryByRole('button')).not.toBeInTheDocument()
        })
      })

      it('should not display notes text field if the status is canceled', async () => {
        render([Permissions.ViewLab], { status: 'canceled' })

        await waitFor(() => {
          expect(screen.getByText('labs.lab.notes')).toBeInTheDocument()
        })
        expect(screen.queryByLabelText('labs.lab.notes')).not.toBeInTheDocument()
      })
    })

    describe('completed lab request', () => {
      it('should display a primary badge if the status is completed', async () => {
        const { expectedLab } = render([Permissions.ViewLab], { status: 'completed' })

        await waitFor(() => {
          expect(screen.getByRole('heading', { name: 'labs.lab.status' })).toBeInTheDocument()
        })
        expect(screen.getByText(expectedLab.status)).toBeInTheDocument()
      })

      it('should display the completed on date if the lab request has been completed', async () => {
        const { expectedLab } = render([Permissions.ViewLab], {
          status: 'completed',
          completedOn: '2020-03-30T04:44:20.102Z',
        })

        await waitFor(() => {
          expect(screen.getByRole('heading', { name: 'labs.lab.completedOn' })).toBeInTheDocument()
        })
        expect(
          screen.getByText(
            format(new Date(expectedLab.completedOn as string), 'yyyy-MM-dd hh:mm a'),
          ),
        ).toBeInTheDocument()
      })

      it('should not display update, complete, and cancel buttons if the lab is completed', async () => {
        render([Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab], {
          status: 'completed',
        })

        await waitFor(() => {
          expect(screen.queryByRole('button')).not.toBeInTheDocument()
        })
      })

      it('should not display notes text field if the status is completed', async () => {
        render([Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab], {
          status: 'completed',
        })

        await waitFor(() => {
          expect(screen.getByText('labs.lab.notes')).toBeInTheDocument()
        })
        expect(screen.queryByLabelText('labs.lab.notes')).not.toBeInTheDocument()
      })
    })
  })

  describe('on update', () => {
    it('should update the lab with the new information', async () => {
      const { history, expectedLab } = render([Permissions.ViewLab])
      const expectedResult = 'expected result'
      const newNotes = 'expected notes'

      const resultTextField = await screen.findByLabelText('labs.lab.result')

      userEvent.type(resultTextField, expectedResult)

      const notesTextField = screen.getByLabelText('labs.lab.notes')
      userEvent.type(notesTextField, newNotes)

      const updateButton = screen.getByRole('button', {
        name: /labs\.requests\.update/i,
      })
      userEvent.click(updateButton)

      const expectedNotes = expectedLab.notes ? [...expectedLab.notes, newNotes] : [newNotes]

      await waitFor(() => {
        expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
        expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(
          expect.objectContaining({ ...expectedLab, result: expectedResult, notes: expectedNotes }),
        )
        expect(history.location.pathname).toEqual('/labs/12456')
      })
    })
  })

  describe('on complete', () => {
    it('should mark the status as completed and fill in the completed date with the current time', async () => {
      const { history, expectedLab, expectedDate } = render([
        Permissions.ViewLab,
        Permissions.CompleteLab,
        Permissions.CancelLab,
      ])
      const expectedResult = 'expected result'

      const resultTextField = await screen.findByLabelText('labs.lab.result')

      userEvent.type(resultTextField, expectedResult)

      const completeButton = screen.getByRole('button', {
        name: 'labs.requests.complete',
      })

      userEvent.click(completeButton)

      await waitFor(() => {
        expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
        expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            ...expectedLab,
            result: expectedResult,
            status: 'completed',
            completedOn: expectedDate.toISOString(),
          }),
        )
        expect(history.location.pathname).toEqual('/labs/12456')
      })
    })
  })

  describe('on cancel', () => {
    it('should mark the status as canceled and fill in the cancelled on date with the current time', async () => {
      const { history, expectedLab, expectedDate } = render([
        Permissions.ViewLab,
        Permissions.CompleteLab,
        Permissions.CancelLab,
      ])
      const expectedResult = 'expected result'

      const resultTextField = await screen.findByLabelText('labs.lab.result')

      userEvent.type(resultTextField, expectedResult)

      const completeButton = screen.getByRole('button', {
        name: 'labs.requests.cancel',
      })

      userEvent.click(completeButton)

      await waitFor(() => {
        expect(LabRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
        expect(LabRepository.saveOrUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            ...expectedLab,
            result: expectedResult,
            status: 'canceled',
            canceledOn: expectedDate.toISOString(),
          }),
        )
        expect(history.location.pathname).toEqual('/labs')
      })
    })
  })
})
