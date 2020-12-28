import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import AddCareGoalModal from '../../../patients/care-goals/AddCareGoalModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import CareGoal from '../../../shared/model/CareGoal'
import Patient from '../../../shared/model/Patient'

describe('Add Care Goal Modal', () => {
  const patient = {
    givenName: 'given Name',
    fullName: 'full name',
    careGoals: [] as CareGoal[],
  } as Patient

  const setup = () => {
    const onCloseSpy = jest.fn()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const history = createMemoryHistory()

    return {
      ...render(
        <Router history={history}>
          <AddCareGoalModal patient={patient} show onCloseButtonClick={onCloseSpy} />
        </Router>,
      ),
      onCloseSpy,
    }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render a modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getAllByText('patient.careGoal.new')[0]).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /patient.careGoal.new/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actions.cancel/i })).toBeInTheDocument()
  })

  it('should render a care goal form', () => {
    setup()

    expect(screen.getByLabelText('care-goal-form')).toBeInTheDocument()
  })

  it('should save care goal when save button is clicked and close', async () => {
    const expectedCreatedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedCreatedDate)

    const expectedCareGoal = {
      description: 'some description',
      createdOn: expectedCreatedDate.toISOString(),
    }

    const { onCloseSpy } = setup()

    userEvent.type(screen.getAllByRole('textbox')[0], expectedCareGoal.description)
    userEvent.click(screen.getByRole('button', { name: /patient.careGoal.new/i }))

    await waitFor(() => {
      expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    })

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        careGoals: expect.arrayContaining([expect.objectContaining(expectedCareGoal)]),
      }),
    )

    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
})
