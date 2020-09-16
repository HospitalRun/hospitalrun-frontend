import useRemovePatientRelatedPerson from '../../../patients/hooks/useRemovePatientRelatedPerson'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import RelatedPerson from '../../../shared/model/RelatedPerson'
import * as uuid from '../../../shared/util/uuid'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use remove patient related person', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should remove a related person with the given id', async () => {
    const expectedRelatedPersonPatientId = 'expected id'
    const expectedPatientId = '123'

    const expectedRelatedPerson = {
      id: 'some id',
      patientId: expectedRelatedPersonPatientId,
      type: 'some type',
    } as RelatedPerson

    const expectedPatient = {
      id: expectedPatientId,
      givenName: 'some name',
      relatedPersons: [expectedRelatedPerson],
    } as Patient

    const expectedUpdatedPatient = {
      ...expectedPatient,
      relatedPersons: [],
    } as Patient

    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedRelatedPersonPatientId)
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedUpdatedPatient)

    const result = await executeMutation(() => useRemovePatientRelatedPerson(), {
      patientId: expectedPatientId,
      relatedPersonId: expectedRelatedPersonPatientId,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedUpdatedPatient)
    expect(result).toEqual([])
  })
})
