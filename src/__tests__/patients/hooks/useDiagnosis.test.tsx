import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'

import useDiagnosis from '../../../patients/hooks/useDiagnosis'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import waitUntilQueryIsSuccessful, {
  waitUntilQueryFails,
} from '../../test-utils/wait-for-query.util'

describe('useDiagnosis', () => {
  const queryCache = new QueryCache()
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>
  )

  afterEach(() => {
    jest.restoreAllMocks()
    queryCache.clear()
  })

  it('should return a diagnosis successfully given a valid patient id and diagnosis id', async () => {
    const expectedPatientId = 'patientId'
    const expectedDiagnosis = { id: 'diagnosisId', name: 'diagnosis name' } as Diagnosis
    const expectedPatient = { id: expectedPatientId, diagnoses: [expectedDiagnosis] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    let resultDiagnosis: any
    await act(async () => {
      const renderHookResult = renderHook(
        () => useDiagnosis(expectedPatientId, expectedDiagnosis.id),
        { wrapper },
      )
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      resultDiagnosis = result.current
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(resultDiagnosis.data).toEqual(expectedDiagnosis)
  })

  it('should throw an error if patient id is not valid', async () => {
    const expectedPatientId = 'patientId'
    const expectedDiagnosisId = 'diagnosisId'
    jest.spyOn(PatientRepository, 'find').mockRejectedValueOnce(new Error('Patient not found'))

    let resultDiagnosis: any
    await act(async () => {
      const renderHookResult = renderHook(
        () => useDiagnosis(expectedPatientId, expectedDiagnosisId),
        { wrapper },
      )
      const { result } = renderHookResult
      await waitUntilQueryFails(renderHookResult)
      resultDiagnosis = result.current
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(resultDiagnosis.error.message).toEqual('Patient not found')
  })

  it('should throw an error if patient id is valid but diagnosis id is not', async () => {
    const expectedPatientId = 'patientId'
    const expectedDiagnosisId = 'diagnosisId'
    const actualDiagnosis = { id: 'actual diagnosisId', name: 'actual diagnosis name' } as Diagnosis
    const expectedPatient = { id: expectedPatientId, diagnoses: [actualDiagnosis] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    let resultDiagnosis: any
    await act(async () => {
      const renderHookResult = renderHook(
        () => useDiagnosis(expectedPatientId, expectedDiagnosisId),
        { wrapper },
      )
      const { result } = renderHookResult
      await waitUntilQueryFails(renderHookResult)
      resultDiagnosis = result.current
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(resultDiagnosis.error.message).toEqual('Diagnosis not found')
  })
})
