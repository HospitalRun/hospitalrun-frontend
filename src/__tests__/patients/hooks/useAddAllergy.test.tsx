import useAddAllergy from '../../../patients/hooks/useAddAllergy'
import * as validateAllergy from '../../../patients/util/validate-allergy'
import PatientRepository from '../../../shared/db/PatientRepository'
import Allergy from '../../../shared/model/Allergy'
import Patient from '../../../shared/model/Patient'
import * as uuid from '../../../shared/util/uuid'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add allergy', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if allergy validation fails', async () => {
    const expectedError = { nameError: 'some error' }
    expectOneConsoleError(expectedError)
    jest.spyOn(validateAllergy, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddAllergy(), { patientId: '123', allergy: {} as Allergy })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })

  it('should add the allergy to the patient', async () => {
    const expectedAllergy = { id: '123', name: 'some name' }
    const givenPatient = { id: 'patientId', allergies: [] as Allergy[] } as Patient
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedAllergy.id)
    const expectedPatient = { ...givenPatient, allergies: [expectedAllergy] }
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)

    const result = await executeMutation(() => useAddAllergy(), {
      patientId: givenPatient.id,
      allergy: expectedAllergy,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    expect(result).toEqual([expectedAllergy])
  })
})
