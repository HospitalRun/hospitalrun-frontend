import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import AddDiagnosisModal from '../../../patients/diagnoses/AddDiagnosisModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

describe('Add Diagnosis Modal', () => {
  const mockDiagnosis: Diagnosis = {
    id: '123',
    name: 'some name',
    diagnosisDate: new Date().toISOString(),
    onsetDate: new Date().toISOString(),
    abatementDate: new Date().toISOString(),
    status: DiagnosisStatus.Active,
    visit: '1234',
    note: 'some note',
  }
  const mockPatient = {
    id: 'patientId',
    diagnoses: [mockDiagnosis],
    carePlans: [
      {
        id: '123',
        title: 'some title',
        description: 'some description',
        diagnosisId: '123',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: CarePlanStatus.Active,
        intent: CarePlanIntent.Proposal,
      },
    ],
  } as Patient

  const setup = (patient = mockPatient, onCloseSpy = jest.fn()) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)

    return render(<AddDiagnosisModal patient={patient} show onCloseButtonClick={onCloseSpy} />)
  }

  it('should render a modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /patient\.diagnoses\.new/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /actions\.cancel/i })).toBeInTheDocument()
  })

  it('should render the diagnosis form', () => {
    setup()

    expect(screen.getByRole('form')).toBeInTheDocument()
  })

  it('should dispatch add diagnosis when the save button is clicked', async () => {
    const patient = mockPatient
    patient.diagnoses = []
    setup(patient)

    const newDiagnosis = mockDiagnosis
    newDiagnosis.name = 'yellow polka dot spots'

    userEvent.type(
      screen.getByPlaceholderText(/patient\.diagnoses\.diagnosisName/i),
      newDiagnosis.name,
    )

    await waitFor(() =>
      userEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: /patient\.diagnoses\.new/i,
        }),
      ),
    )

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        diagnoses: [expect.objectContaining({ name: 'yellow polka dot spots' })],
      }),
    )
    expect(await screen.queryByRole('dialogue')).not.toBeInTheDocument()
  })

  it('should call the on close function when the cancel button is clicked', async () => {
    const onCloseButtonClickSpy = jest.fn()
    setup(mockPatient, onCloseButtonClickSpy)

    await waitFor(() =>
      userEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: /actions\.cancel/i,
        }),
      ),
    )
    expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
  })
})
