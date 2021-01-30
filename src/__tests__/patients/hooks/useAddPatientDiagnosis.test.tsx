import useAddPatientDiagnosis from '../../../patients/hooks/useAddPatientDiagnosis'
import * as validateDiagnosis from '../../../patients/util/validate-diagnosis'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import * as uuid from '../../../shared/util/uuid'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add diagnosis', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if diagnosis validation fails', async () => {
    const expectedError = { name: 'some error' }
    expectOneConsoleError(expectedError as Error)
    jest.spyOn(validateDiagnosis, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddPatientDiagnosis(), {
        patientId: '123',
        diagnosis: {} as Diagnosis,
      })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })

  it('should add the diaganosis to the patient', async () => {
    const expectedDiagnosis: Diagnosis = {
      id: '123',
      name: 'New Diagnosis Name',
      diagnosisDate: new Date().toISOString(),
      onsetDate: new Date().toISOString(),
      abatementDate: new Date().toISOString(),
      status: DiagnosisStatus.Active,
      visit: '1234',
      note: 'some note',
    }
    const givenPatient = { id: 'patientId', diagnoses: [] as Diagnosis[] } as Patient
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedDiagnosis.id)
    const expectedPatient = { ...givenPatient, diagnoses: [expectedDiagnosis] }
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)

    const result = await executeMutation(() => useAddPatientDiagnosis(), {
      patientId: givenPatient.id,
      diagnosis: expectedDiagnosis,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        diagnoses: [expect.objectContaining({ name: 'New Diagnosis Name' })],
      }),
    )
    expect(result).toEqual([expectedDiagnosis])
  })
})
