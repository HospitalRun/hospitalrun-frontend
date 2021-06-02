import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ButtonBarProvider } from '../../../page-header/button-toolbar/ButtonBarProvider'
import ButtonToolbar from '../../../page-header/button-toolbar/ButtonToolBar'
import * as titleUtil from '../../../page-header/title/TitleContext'
import ViewPatient from '../../../patients/view/ViewPatient'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('ViewPatient', () => {
  const testPatient = ({
    id: '123',
    prefix: 'prefix',
    givenName: 'givenName',
    familyName: 'familyName',
    suffix: 'suffix',
    sex: 'male',
    type: 'charity',
    occupation: 'occupation',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email@email.com',
    address: 'address',
    code: 'P00001',
    dateOfBirth: new Date().toISOString(),
  } as unknown) as Patient

  interface SetupProps {
    permissions?: string[]
    startPath?: string
  }
  const setup = ({
    permissions = [],
    startPath = `/patients/${testPatient.id}`,
  }: SetupProps = {}) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(testPatient)
    jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue([])
    jest.spyOn(PatientRepository, 'getMedications').mockResolvedValue([])

    const history = createMemoryHistory({ initialEntries: [startPath] })
    const store = mockStore({
      user: { permissions: [Permissions.ReadPatients, ...permissions] },
    } as any)

    return {
      history,
      store,
      ...render(
        <Provider store={store}>
          <ButtonBarProvider>
            <ButtonToolbar />
            <Router history={history}>
              <Route path="/patients/:id">
                <TitleProvider>
                  <ViewPatient />
                </TitleProvider>
              </Route>
            </Router>
          </ButtonBarProvider>
        </Provider>,
      ),
    }
  }

  it('should dispatch fetchPatient when component loads', async () => {
    setup()

    await waitFor(() => {
      expect(PatientRepository.find).toHaveBeenCalledWith(testPatient.id)
    })
  })

  it('should render an "Edit Patient" button to the button tool bar if user has WritePatients permissions', async () => {
    setup({ permissions: [Permissions.WritePatients] })

    await waitFor(() => {
      expect(screen.getByText(/actions\.edit/i)).toBeInTheDocument()
    })
  })

  it('should render an empty button toolbar if the user has only ReadPatients permissions', async () => {
    setup()

    expect(screen.queryByText(/actions\.edit/i)).not.toBeInTheDocument()
  })

  it('should render a tabs header with the correct tabs', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getAllByRole('tab')).toHaveLength(12)
    })
    expect(screen.getByRole('tab', { name: /patient\.generalInformation/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.relatedPersons\.label/i })).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /scheduling\.appointments\.label/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.allergies\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.diagnoses\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.notes\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.medications\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.labs\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.carePlan\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.careGoal\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.visits\.label/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /patient\.history\.label/i })).toBeInTheDocument()
  })

  it('should mark the general information tab as active and render the general information component when route is /patients/:id', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.generalInformation/i })).toHaveClass(
        'active',
      )
    })
    expect(screen.getByText(/patient\.basicinformation/i)).toBeInTheDocument()
  })

  it('should navigate /patients/:id when the general information tab is clicked', async () => {
    const { history } = setup({ startPath: `/patients/${testPatient.id}/relatedpersons` }) // Start from NOT the General Information tab

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.generalInformation/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}`)
    })
  })

  it('should mark the related persons tab as active when it is clicked and render the Related Person Tab component when route is /patients/:id/relatedpersons', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.relatedPersons\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/relatedpersons`)
    })
    expect(screen.getByRole('button', { name: /patient\.relatedPersons\.label/i })).toHaveClass(
      'active',
    )
    await waitFor(() => {
      expect(
        screen.getByText(/patient\.relatedPersons\.warning\.noRelatedPersons/i),
      ).toBeInTheDocument()
    })
  })

  it('should mark the appointments tab as active when it is clicked and render the appointments tab component when route is /patients/:id/appointments', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /scheduling\.appointments\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/appointments`)
    })
    expect(screen.getByRole('button', { name: /scheduling\.appointments\.label/i })).toHaveClass(
      'active',
    )
    await waitFor(() => {
      expect(
        screen.getByText(/patient\.appointments\.warning\.noAppointments/i),
      ).toBeInTheDocument()
    })
  })

  it('should mark the allergies tab as active when it is clicked and render the allergies component when route is /patients/:id/allergies', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.allergies\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/allergies`)
    })
    expect(screen.getByRole('button', { name: /patient\.allergies\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.allergies\.warning\.noAllergies/i)).toBeInTheDocument()
    })
  })

  it('should render the allergies tab as active when route starts with /patients/:id/allergies', async () => {
    setup({ startPath: `/patients/${testPatient.id}/allergies/nested-route` })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.allergies\.label/i })).toHaveClass(
        'active',
      )
    })
  })

  it('should mark the diagnoses tab as active when it is clicked and render the diagnoses component when route is /patients/:id/diagnoses', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.diagnoses\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/diagnoses`)
    })
    expect(screen.getByRole('button', { name: /patient\.diagnoses\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.diagnoses\.warning\.noDiagnoses/i)).toBeInTheDocument()
    })
  })

  it('should mark the notes tab as active when it is clicked and render the note component when route is /patients/:id/notes', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.notes\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/notes`)
    })
    expect(screen.getByRole('button', { name: /patient\.notes\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.notes\.warning\.noNotes/i)).toBeInTheDocument()
    })
  })

  it('should render the notes tab as active when route starts with /patients/:id/notes', async () => {
    setup({ startPath: `/patients/${testPatient.id}/notes/nested-route` })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.notes\.label/i })).toHaveClass('active')
    })
  })

  it('should mark the medications tab as active when it is clicked and render the medication component when route is /patients/:id/medications', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.medications\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/medications`)
    })
    expect(screen.getByRole('button', { name: /patient\.medications\.label/i })).toHaveClass(
      'active',
    )
    await waitFor(() => {
      expect(screen.getByText(/patient\.medications\.warning\.noMedications/i)).toBeInTheDocument()
    })
  })

  it('should mark the labs tab as active when it is clicked and render the lab component when route is /patients/:id/labs', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.labs\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/labs`)
    })
    expect(screen.getByRole('button', { name: /patient\.labs\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.labs\.warning\.noLabs/i)).toBeInTheDocument()
    })
  })

  it('should mark the care plans tab as active when it is clicked and render the care plan tab component when route is /patients/:id/care-plans', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.carePlan\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/care-plans`)
    })
    expect(screen.getByRole('button', { name: /patient\.carePlan\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.carePlans\.warning\.noCarePlans/i)).toBeInTheDocument()
    })
  })

  it('should render the care plans tab as active when route starts with /patients/:id/care-plans', async () => {
    setup({ startPath: `/patients/${testPatient.id}/care-plans/nested-route` })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.carePlan\.label/i })).toHaveClass(
        'active',
      )
    })
  })

  it('should mark the care goals tab as active when it is clicked and render the care goal tab component when route is /patients/:id/care-goals', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.careGoal\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/care-goals`)
    })
    expect(screen.getByRole('button', { name: /patient\.careGoal\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.careGoals\.warning\.noCareGoals/i)).toBeInTheDocument()
    })
  })

  it('should render the care goals tab as active when route starts with /patients/:id/care-goals', async () => {
    setup({ startPath: `/patients/${testPatient.id}/care-goals/nested-route` })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.careGoal\.label/i })).toHaveClass(
        'active',
      )
    })
  })

  it('should mark the visits tab as active when it is clicked and render the visit tab component when route is /patients/:id/visits', async () => {
    const { history } = setup()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /patient\.visits\.label/i }))
    })

    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/patients/${testPatient.id}/visits`)
    })
    expect(screen.getByRole('button', { name: /patient\.visits\.label/i })).toHaveClass('active')
    await waitFor(() => {
      expect(screen.getByText(/patient\.visits\.warning\.noVisits/i)).toBeInTheDocument()
    })
  })

  it('should render the visits tab as active when route starts with /patients/:id/visits', async () => {
    setup({ startPath: `/patients/${testPatient.id}/visits/nested-route` })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /patient\.visits\.label/i })).toHaveClass('active')
    })
  })
})
