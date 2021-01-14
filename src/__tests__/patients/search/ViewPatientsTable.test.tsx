import { screen, render, waitFor } from '@testing-library/react'
import format from 'date-fns/format'
import React from 'react'

import PatientSearchRequest from '../../../patients/models/PatientSearchRequest'
import ViewPatientsTable from '../../../patients/search/ViewPatientsTable'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

describe('View Patients Table', () => {
  const setup = (expectedSearchRequest: PatientSearchRequest, expectedPatients: Patient[]) => {
    jest.spyOn(PatientRepository, 'search').mockResolvedValueOnce(expectedPatients)
    jest.spyOn(PatientRepository, 'count').mockResolvedValueOnce(expectedPatients.length)

    return render(<ViewPatientsTable searchRequest={expectedSearchRequest} />)
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should search for patients given a search request', () => {
    const expectedSearchRequest = { queryString: 'someQueryString' }
    setup(expectedSearchRequest, [])

    expect(PatientRepository.search).toHaveBeenCalledTimes(1)
    expect(PatientRepository.search).toHaveBeenCalledWith(expectedSearchRequest.queryString)
  })

  it('should display no patients exist if total patient count is 0', async () => {
    setup({ queryString: '' }, [])
    expect(await screen.findByRole('heading', { name: /patients.noPatients/i })).toBeInTheDocument()
  })

  it('should render a table', async () => {
    const expectedPatient = {
      id: '123',
      givenName: 'givenName',
      familyName: 'familyName',
      code: 'test code',
      sex: 'sex',
      dateOfBirth: new Date(2010, 1, 1, 1, 1, 1, 1).toISOString(),
    } as Patient
    const expectedPatients = [expectedPatient]

    setup({ queryString: '' }, expectedPatients)

    await waitFor(() => screen.getByText('familyName'))
    const cells = screen.getAllByRole('cell')

    expect(screen.getByRole('columnheader', { name: /patient\.code/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient\.givenName/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient\.familyName/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient\.sex/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /patient\.dateOfBirth/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /actions\.label/i })).toBeInTheDocument()

    Object.keys(expectedPatient)
      .filter((key) => key !== 'id' && key !== 'dateOfBirth')
      .forEach((key) => {
        expect(
          screen.getByRole('cell', { name: expectedPatient[key as keyof Patient] as string }),
        ).toBeInTheDocument()
      })

    expect(cells[4]).toHaveTextContent(
      format(Date.parse(expectedPatient.dateOfBirth), 'MM/dd/yyyy'),
    )
  })
})
