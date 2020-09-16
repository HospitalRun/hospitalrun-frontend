import usePatientVisits from '../../../patients/hooks/usePatientVisits'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient visits', () => {
  it(`should return the should return the patient's visits`, async () => {
    const expectedPatientId = '123'

    const patient = {
      id: expectedPatientId,
      visits: [
        { id: '123', reason: 'reason for visit' },
        { id: '124', reason: 'visit for reason' },
      ],
    } as Patient

    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(patient)

    const actualVisits = await executeQuery(() => usePatientVisits(expectedPatientId))

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualVisits).toEqual(patient.visits)
  })
})
