import useDiagnosis from '../../../patients/hooks/useDiagnosis'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('useDiagnosis', () => {
  let errorMock: jest.SpyInstance

  beforeEach(() => {
    jest.resetAllMocks()
    errorMock = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    errorMock.mockRestore()
  })

  it('should return a diagnosis successfully given a valid patient id and diagnosis id', async () => {
    const expectedPatientId = 'patientId'
    const expectedDiagnosis = { id: 'diagnosisId', name: 'diagnosis name' } as Diagnosis
    const expectedPatient = { id: expectedPatientId, diagnoses: [expectedDiagnosis] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    const actualDiagnosis = await executeQuery(() =>
      useDiagnosis(expectedPatientId, expectedDiagnosis.id),
    )

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualDiagnosis).toEqual(expectedDiagnosis)
  })

  it('should throw an error if patient id is not valid', async () => {
    const expectedPatientId = 'patientId'
    const expectedDiagnosisId = 'diagnosisId'
    jest.spyOn(PatientRepository, 'find').mockRejectedValueOnce(new Error('Patient not found'))

    try {
      await executeQuery(
        () => useDiagnosis(expectedPatientId, expectedDiagnosisId),
        (queryResult) => queryResult.isError,
      )
    } catch (e) {
      expect(e).toEqual(new Error('Patient not found'))
    }
  })

  it('should throw an error if patient id is valid but diagnosis id is not', async () => {
    const expectedPatientId = 'patientId'
    const expectedDiagnosisId = 'diagnosisId'
    const actualDiagnosis = { id: 'actual diagnosisId', name: 'actual diagnosis name' } as Diagnosis
    const expectedPatient = { id: expectedPatientId, diagnoses: [actualDiagnosis] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    try {
      await executeQuery(
        () => useDiagnosis(expectedPatientId, expectedDiagnosisId),
        (queryResult) => queryResult.isError,
      )
    } catch (e) {
      expect(e).toEqual(new Error('Diagnosis not found'))
    }
  })
})
