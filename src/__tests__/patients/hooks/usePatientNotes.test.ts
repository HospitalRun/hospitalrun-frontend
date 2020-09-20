import usePatientNotes from '../../../patients/hooks/usePatientNotes'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient notes', () => {
  it('should get patient notes', async () => {
    const expectedPatientId = '123'

    const expectedNotes = [{ id: '456', text: 'eome name', date: '1947-09-09T14:48:00.000Z' }]
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce({
      id: expectedPatientId,
      notes: expectedNotes,
    } as Patient)

    const actualNotes = await executeQuery(() => usePatientNotes(expectedPatientId))

    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualNotes).toEqual(expectedNotes)
  })
})
