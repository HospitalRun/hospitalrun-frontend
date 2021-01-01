import useAddPatientRelatedPerson from '../../../patients/hooks/useAddPatientRelatedPerson'
import * as validateRelatedPerson from '../../../patients/util/validate-related-person'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import RelatedPerson from '../../../shared/model/RelatedPerson'
import * as uuid from '../../../shared/util/uuid'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add patient related person', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if related person not specified', async () => {
    const expectedError = { relatedPersonError: 'some error' }
    expectOneConsoleError(expectedError)
    jest.spyOn(validateRelatedPerson, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddPatientRelatedPerson(), {
        patientId: '123',
        relatedPerson: {} as RelatedPerson,
      })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })

  it('should throw an error if the relation type is not specified', async () => {
    const expectedError = { relationshipTypeError: 'some error' }
    expectOneConsoleError(expectedError)
    jest.spyOn(validateRelatedPerson, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddPatientRelatedPerson(), {
        patientId: '123',
        relatedPerson: { patientId: '456' } as RelatedPerson,
      })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })

  it('should add the related person to the patient', async () => {
    const expectedRelated = { id: '123', patientId: '456', type: 'some type' } as RelatedPerson
    const givenPatient = { id: 'patientId', relatedPersons: [] as RelatedPerson[] } as Patient
    const expectedPatient = { ...givenPatient, relatedPersons: [expectedRelated] } as Patient
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedRelated.id)
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)

    const result = await executeMutation(() => useAddPatientRelatedPerson(), {
      patientId: givenPatient.id,
      relatedPerson: expectedRelated,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(2) // Once looking up the patient, once looking up the related person to cache
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    expect(result).toEqual([expectedRelated])
  })
})
