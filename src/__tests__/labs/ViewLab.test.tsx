import { Toaster } from '@hospitalrun/components'
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { createMemoryHistory } from 'history'
import React from 'react'
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

const mockPatient = { fullName: 'Full Name' }

const setup = (lab?: Partial<Lab>, permissions = [Permissions.ViewLab], error = {}) => {
  const expectedDate = new Date()
  let mockLab = {
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
  jest.spyOn(LabRepository, 'saveOrUpdate').mockImplementation(async (newOrUpdatedLab) => {
    mockLab = newOrUpdatedLab
    return mockLab
  })
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

  return {
    history,
    mockLab,
    expectedDate,
    ...render(
      <ButtonBarProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/labs/:id">
              <titleUtil.TitleProvider>
                <ViewLab />
              </titleUtil.TitleProvider>
            </Route>
          </Router>
          <Toaster draggable hideProgressBar />
        </Provider>
      </ButtonBarProvider>,
    ),
  }
}

describe('View Lab', () => {
  describe('page content', () => {
    it("should display the patients' full name", async () => {
      setup()

      expect(await screen.findByRole('heading', { name: mockPatient.fullName })).toBeInTheDocument()
    })

    it('should display the lab-type', async () => {
      const { mockLab } = setup({ type: 'expected type' })

      expect(await screen.findByRole('heading', { name: mockLab.type })).toBeInTheDocument()
    })

    it('should display the requested on date', async () => {
      const { mockLab } = setup({ requestedOn: '2020-03-30T04:43:20.102Z' })

      expect(
        await screen.findByRole('heading', {
          name: format(new Date(mockLab.requestedOn), 'yyyy-MM-dd hh:mm a'),
        }),
      ).toBeInTheDocument()
    })

    it('should not display the completed date if the lab is not completed', async () => {
      const completedDate = new Date('2020-10-10T10:10:10.100') // We want a different date than the mocked date
      setup({ completedOn: completedDate.toISOString() })

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
      expect(
        screen.queryByText(format(completedDate, 'yyyy-MM-dd HH:mm a')),
      ).not.toBeInTheDocument()
    })

    it('should not display the cancelled date if the lab is not cancelled', async () => {
      const cancelledDate = new Date('2020-10-10T10:10:10.100') // We want a different date than the mocked date
      setup({ canceledOn: cancelledDate.toISOString() })

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
      expect(
        screen.queryByText(format(cancelledDate, 'yyyy-MM-dd HH:mm a')),
      ).not.toBeInTheDocument()
    })

    it('should render a result text field', async () => {
      const { mockLab } = setup({ result: 'expected results' })

      expect(
        await screen.findByRole('textbox', {
          name: /labs\.lab\.result/i,
        }),
      ).toHaveValue(mockLab.result)
    })

    it('should not display past notes if there is not', async () => {
      setup({ notes: [] })

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
      expect(screen.queryAllByTestId('note')).toHaveLength(0)
    })

    it('should display the past notes that are not deleted', async () => {
      const expectedNotes = {
        id: 'test-note-id',
        date: new Date().toISOString(),
        text: 'expected notes',
        deleted: false,
      }

      setup({ notes: [expectedNotes] })

      expect(await screen.findByTestId('note')).toHaveTextContent(expectedNotes.text)
    })

    it('should not display the past notes that are deleted', async () => {
      const deletedNote = {
        id: 'test-note-id',
        date: new Date().toISOString(),
        text: 'deleted note',
        deleted: true,
      }

      setup({ notes: [deletedNote] })
      expect(await screen.queryByText('deleted note')).toBe(null)
    })

    it('should display the notes text field empty', async () => {
      setup()

      expect(await screen.findByLabelText('labs.lab.notes')).toHaveValue('')
    })

    it('should display errors', async () => {
      const expectedError = { message: 'some message', result: 'some result feedback' } as LabError
      setup({ status: 'requested' }, [Permissions.ViewLab, Permissions.CompleteLab])

      expectOneConsoleError(expectedError)
      jest.spyOn(validateUtil, 'validateLabComplete').mockReturnValue(expectedError)

      userEvent.click(
        await screen.findByRole('button', {
          name: /labs\.requests\.complete/i,
        }),
      )

      const alert = await screen.findByRole('alert')

      expect(alert).toContainElement(screen.getByText(/states\.error/i))
      expect(alert).toContainElement(screen.getByText(/some message/i))
      expect(screen.getByLabelText(/labs\.lab\.result/i)).toHaveClass('is-invalid')
    })

    describe('requested lab request', () => {
      it('should display a warning badge if the status is requested', async () => {
        const { mockLab } = setup()

        const status = await screen.findByText(mockLab.status)
        expect(status.closest('span')).toHaveClass('badge-warning')
      })

      it('should display a update lab, complete lab, and cancel lab button if the lab is in a requested state', async () => {
        setup({}, [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab])

        expect(await screen.findAllByRole('button')).toEqual(
          expect.arrayContaining([
            screen.getByText(/labs\.requests\.update/i),
            screen.getByText(/labs\.requests\.complete/i),
            screen.getByText(/labs\.requests\.cancel/i),
          ]),
        )
      })
    })

    describe('canceled lab request', () => {
      it('should display a danger badge if the status is canceled', async () => {
        const { mockLab } = setup({ status: 'canceled' })

        const status = await screen.findByText(mockLab.status)
        expect(status.closest('span')).toHaveClass('badge-danger')
      })

      it('should display the cancelled on date if the lab request has been cancelled', async () => {
        const { mockLab } = setup({
          status: 'canceled',
          canceledOn: '2020-03-30T04:45:20.102Z',
        })

        expect(
          await screen.findByRole('heading', {
            name: format(new Date(mockLab.canceledOn as string), 'yyyy-MM-dd hh:mm a'),
          }),
        ).toBeInTheDocument()
      })

      it('should not display update, complete, and cancel button if the lab is canceled', async () => {
        setup(
          {
            status: 'canceled',
          },
          [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab],
        )

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })

      it('should not display notes text field if the status is canceled', async () => {
        setup({ status: 'canceled' })

        expect(await screen.findByText(/labs\.lab\.notes/i)).toBeInTheDocument()
        expect(screen.queryByLabelText(/labs\.lab\.notes/i)).not.toBeInTheDocument()
      })
    })

    describe('completed lab request', () => {
      it('should display a primary badge if the status is completed', async () => {
        const { mockLab } = setup({ status: 'completed' })

        const status = await screen.findByText(mockLab.status)
        expect(status.closest('span')).toHaveClass('badge-primary')
      })

      it('should display the completed on date if the lab request has been completed', async () => {
        const { mockLab } = setup({
          status: 'completed',
          completedOn: '2020-03-30T04:44:20.102Z',
        })

        expect(
          await screen.findByText(
            format(new Date(mockLab.completedOn as string), 'yyyy-MM-dd hh:mm a'),
          ),
        ).toBeInTheDocument()
      })

      it('should not display update, complete, and cancel buttons if the lab is completed', async () => {
        setup(
          {
            status: 'completed',
          },
          [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab],
        )

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })

      it('should not display notes text field if the status is completed', async () => {
        setup(
          {
            status: 'completed',
          },
          [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab],
        )

        expect(await screen.findByText(/labs\.lab\.notes/i)).toBeInTheDocument()
        expect(screen.queryByLabelText(/labs\.lab\.notes/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('on update', () => {
    it('should update the lab with the new information', async () => {
      const { history } = setup()
      const expectedResult = 'expected result'
      const newNotes = 'expected notes'

      const resultTextField = await screen.findByLabelText(/labs\.lab\.result/i)
      userEvent.type(resultTextField, expectedResult)

      const notesTextField = screen.getByLabelText('labs.lab.notes')
      userEvent.type(notesTextField, newNotes)

      userEvent.click(
        screen.getByRole('button', {
          name: /labs\.requests\.update/i,
        }),
      )

      await waitFor(() => {
        expect(history.location.pathname).toEqual('/labs/12456')
      })
      expect(screen.getByLabelText(/labs\.lab\.result/i)).toHaveTextContent(expectedResult)
      expect(screen.getByTestId('note')).toHaveTextContent(newNotes)
    })

    it('should be able delete an note from the lab', async () => {
      const notes = [
        {
          id: 'earth-test-id',
          date: new Date().toISOString(),
          text: 'Hello earth, first note',
          deleted: false,
        },
        {
          id: 'mars-test-id',
          date: new Date().toISOString(),
          text: 'Hello mars, second note',
          deleted: false,
        },
      ]
      setup({ notes })

      expect(await screen.findByText(notes[0].text)).toBeInTheDocument()
      expect(await screen.findByText(notes[1].text)).toBeInTheDocument()

      act(() => userEvent.click(screen.getByTestId(`delete-note-${notes[1].id}`)))

      expect(await screen.findByText(notes[0].text)).toBeInTheDocument()
      expect(await screen.queryByText(notes[1].text)).not.toBeInTheDocument()
    })
  })

  describe('on complete', () => {
    it('should mark the status as completed and fill in the completed date with the current time', async () => {
      const { history } = setup({}, [
        Permissions.ViewLab,
        Permissions.CompleteLab,
        Permissions.CancelLab,
      ])
      const expectedResult = 'expected result'

      userEvent.type(await screen.findByLabelText(/labs\.lab\.result/i), expectedResult)

      userEvent.click(
        screen.getByRole('button', {
          name: /labs\.requests\.complete/i,
        }),
      )

      await waitFor(() => {
        expect(history.location.pathname).toEqual('/labs/12456')
      })
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(
        within(screen.getByRole('alert')).getByText(/labs\.successfullyCompleted/i),
      ).toBeInTheDocument()
    })

    it('should disallow deleting notes', async () => {
      const labNote = {
        id: 'earth-test-id',
        date: new Date().toISOString(),
        text: 'A note from the lab!',
        deleted: false,
      }

      setup(
        {
          notes: [labNote],
          status: 'completed',
        },
        [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab],
      )

      const notes = await screen.findAllByTestId('note')
      expect(notes).toHaveLength(1)
      expect(notes[0]).toHaveTextContent(labNote.text)
      expect(screen.queryAllByRole('button', { name: 'Delete' })).toHaveLength(0)
    })
  })

  describe('on cancel', () => {
    // integration test candidate; after 'cancelled' route goes to <Labs />
    // 'should mark the status as canceled and fill in the cancelled on date with the current time'
    it('should mark the status as canceled and redirect to /labs', async () => {
      const { history } = setup({}, [
        Permissions.ViewLab,
        Permissions.CompleteLab,
        Permissions.CancelLab,
      ])
      const expectedResult = 'expected result'

      userEvent.type(await screen.findByLabelText(/labs\.lab\.result/i), expectedResult)

      userEvent.click(
        screen.getByRole('button', {
          name: /labs\.requests\.cancel/i,
        }),
      )

      await waitFor(() => {
        expect(history.location.pathname).toEqual('/labs')
      })
    })

    it('should disallow deleting notes', async () => {
      const labNote = {
        id: 'earth-test-id',
        date: new Date().toISOString(),
        text: 'A note from the lab!',
        deleted: false,
      }

      setup(
        {
          notes: [labNote],
          status: 'canceled',
        },
        [Permissions.ViewLab, Permissions.CompleteLab, Permissions.CancelLab],
      )

      const notes = await screen.findAllByTestId('note')
      expect(notes).toHaveLength(1)
      expect(notes[0]).toHaveTextContent(labNote.text)
      expect(screen.queryAllByRole('button', { name: 'Delete' })).toHaveLength(0)
    })
  })
})
