import { renderHook, act } from '@testing-library/react-hooks'
import { omit } from 'lodash'
import { queryCache } from 'react-query'

import useUpdatePatient from '../../../patients/hooks/useUpdatePatient'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'

const patient: Patient = {
  id: 'abc123',
  sex: 'Male',
  givenName: 'John',
  familyName: 'Doe',
  dateOfBirth: '01/11/1988',
  isApproximateDateOfBirth: false,
  code: 'abc123',
  index: '1',
  carePlans: [],
  careGoals: [],
  bloodType: 'A+',
  visits: [],
  rev: 'asd',
  createdAt: '01/01/2020',
  updatedAt: '01/01/2020',
  phoneNumbers: [],
  emails: [],
  addresses: [],
}

describe('useUpdatePatient hook', () => {
  afterEach(() => {
    queryCache.clear()
  })

  it('returns the errors in case the patient is invalid', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => undefined)

    const { result, waitFor } = renderHook(() => useUpdatePatient())
    const [updatePatient] = result.current

    act(() => {
      updatePatient({ ...patient, givenName: '' })
    })

    await waitFor(() => result.current[1].isError)

    const [, { error }] = result.current

    expect(error?.message).toBeTruthy()
    expect(error?.fieldErrors.givenName).toBeTruthy()
  })

  it('calls the patient update repository with the proper payload', async () => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValueOnce(patient)

    const { result, waitFor } = renderHook(() => useUpdatePatient())
    const [updatePatient] = result.current

    act(() => {
      updatePatient({ ...patient })
    })

    await waitFor(() => result.current[1].isSuccess)

    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith({
      fullName: `${patient.givenName} ${patient.familyName}`,
      ...omit(patient, ['emails', 'phoneNumbers', 'addresses']),
    })
  })

  it('updates the patient cache when the mutation succeeds', async () => {
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValueOnce(patient)

    const { result, waitFor } = renderHook(() => useUpdatePatient())
    const [updatePatient] = result.current

    expect(queryCache.getQueryData(['patient', patient.id])).toBeUndefined()

    act(() => {
      updatePatient({ ...patient })
    })

    await waitFor(() => result.current[1].isSuccess)

    expect(queryCache.getQueryData(['patient', patient.id])).toEqual(patient)
  })
})
