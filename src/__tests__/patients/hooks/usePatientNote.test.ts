/* eslint-disable no-console */

import usePatientNote from '../../../patients/hooks/usePatientNote'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import executeQuery from '../../test-utils/use-query.util'

describe('use note', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    console.error = jest.fn()
  })

  it('should return a note given a patient id and note id', async () => {
    const expectedPatientId = '123'
    const expectedNote = { id: '456', text: 'eome name', date: '1947-09-09T14:48:00.000Z' }
    const expectedPatient = { id: expectedPatientId, notes: [expectedNote] } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    const actualNote = await executeQuery(() => usePatientNote(expectedPatientId, expectedNote.id))

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.find).toHaveBeenCalledWith(expectedPatientId)
    expect(actualNote).toEqual(expectedNote)
  })

  it('should throw an error if patient does not have note with id', async () => {
    const expectedPatientId = '123'
    const expectedNote = { id: '456', text: 'eome name', date: '1947-09-09T14:48:00.000Z' }
    const expectedPatient = {
      id: expectedPatientId,
      notes: [{ id: '426', text: 'eome name', date: '1947-09-09T14:48:00.000Z' }],
    } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(expectedPatient)

    try {
      await executeQuery(() => usePatientNote(expectedPatientId, expectedNote.id))
    } catch (e) {
      expect(e).toEqual(new Error('Timed out in waitFor after 1000ms.'))
    }
  })
})
