import useAllergy from '../../../patients/hooks/useAllergy'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use allergy', () => {
  let errorMock: jest.SpyInstance

  beforeEach(() => {
    jest.resetAllMocks()
    errorMock = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    errorMock.mockRestore()
  })

  it('should return an allergy given a patient id and allergy id', async () => {
    const expectedPatientId = '123'
    const expectedAllergy = { id: '456', name: 'some name' }
    const expectedPatient = { id: expectedPatientId, allergies: [expectedAllergy] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    const actualAllergy = await executeQuery(() =>
      useAllergy(expectedPatientId, expectedAllergy.id),
    )

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualAllergy).toEqual(expectedAllergy)
  })

  it('should throw an error if patient does not have allergy with id', async () => {
    const expectedPatientId = '123'
    const expectedAllergy = { id: '456', name: 'some name' }
    const expectedPatient = {
      id: 'expectedPatientId',
      allergies: [{ id: '426', name: 'some name' }],
    } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    try {
      await executeQuery(
        () => useAllergy(expectedPatientId, expectedAllergy.id),
        (query) => query.isError,
      )
    } catch (e) {
      expect(e).toEqual(new Error('Allergy not found'))
    }
  })
})
