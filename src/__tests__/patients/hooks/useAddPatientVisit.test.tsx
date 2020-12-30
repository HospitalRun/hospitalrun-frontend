import useAddVisit from '../../../patients/hooks/useAddVisit'
import * as validateVisit from '../../../patients/util/validate-visit'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Visit from '../../../shared/model/Visit'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add visit', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should add a visit to the patient', async () => {
    const expectedDate = new Date()
    Date.now = jest.fn().mockReturnValue(expectedDate)

    const expectedVisit: Visit[] = [
      {
        id: '123',
        reason: 'reason for visit',
        createdAt: expectedDate.toISOString(),
        updatedAt: expectedDate.toISOString(),
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        type: 'type',
        status: 'planned',
        reason: 'given reason',
        location: 'give location',
      },
    ]
    const givenPatient = { id: 'patientId' } as Patient

    const expectedPatient = { ...givenPatient, visits: expectedVisit }
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)

    const result = await executeMutation(() => useAddVisit(), {
      patientId: givenPatient.id,
      visit: expectedVisit[0],
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    expect(result).toEqual(expectedVisit)
  })

  it('should throw an error if validation fails', async () => {
    const expectedError: Error = { message: 'patient.visit.error.unableToAdd', name: 'some error' }
    expectOneConsoleError(expectedError)

    jest.spyOn(validateVisit, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddVisit(), { patientId: '123', visit: {} })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })
})
