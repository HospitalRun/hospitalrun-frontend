import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import DiagnosesList from '../../../patients/diagnoses/DiagnosesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

const expectedDiagnoses = [
  { id: '123', name: 'diagnosis1', diagnosisDate: new Date().toISOString() } as Diagnosis,
]

describe('Diagnoses list', () => {
  const setup = async (diagnoses: Diagnosis[]) => {
    jest.resetAllMocks()
    const mockPatient = { id: '123', diagnoses } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)

    return render(<DiagnosesList patientId={mockPatient.id} />)
  }

  it('should list the patients diagnoses', async () => {
    const diagnoses = expectedDiagnoses as Diagnosis[]
    const { container } = await setup(diagnoses)
    await waitFor(() => {
      expect(container.querySelector('.list-group')).toBeInTheDocument()
    })
    const listItems = container.querySelectorAll('.list-group-item')
    expect(listItems).toHaveLength(expectedDiagnoses.length)
    expect(listItems[0]).toHaveTextContent(expectedDiagnoses[0].name)
  })

  it('should render a warning message if the patient does not have any diagnoses', async () => {
    const { container } = await setup([])
    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(container.querySelector('.list-group')).not.toBeInTheDocument()
    expect(alert).toHaveClass('alert-warning')
    expect(screen.getByText(/patient.diagnoses.warning.noDiagnoses/i)).toBeInTheDocument()
    expect(screen.getByText(/patient.diagnoses.addDiagnosisAbove/i)).toBeInTheDocument()
  })
})
