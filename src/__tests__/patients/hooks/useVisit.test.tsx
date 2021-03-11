import useVisit from '../../../patients/hooks/useVisit'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use visit', () => {
  it(`should return the should return the patient's visit`, async () => {
    const expectedPatientId = '123'

    const patient = {
      id: expectedPatientId,
      visits: [
        { id: '123', reason: 'reason for visit' },
        { id: '124', reason: 'visit for reason' },
      ],
    } as Patient

    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(patient)

    const actualVisit = await executeQuery(() => useVisit(expectedPatientId, '123'))

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualVisit).toEqual(patient.visits[0])
  })
})
