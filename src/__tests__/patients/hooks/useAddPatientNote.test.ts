import useAddPatientNote from '../../../patients/hooks/useAddPatientNote'
import * as validateNote from '../../../patients/util/validate-note'
import PatientRepository from '../../../shared/db/PatientRepository'
import Note from '../../../shared/model/Note'
import Patient from '../../../shared/model/Patient'
import * as uuid from '../../../shared/util/uuid'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add note', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if note validation fails', async () => {
    const expectedError = { nameError: 'some error' }
    expectOneConsoleError(expectedError)
    jest.spyOn(validateNote, 'default').mockReturnValue(expectedError)
    jest.spyOn(PatientRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useAddPatientNote(), { patientId: '123', note: {} as Note })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(PatientRepository.saveOrUpdate).not.toHaveBeenCalled()
  })

  it('should add the note to the patient', async () => {
    const expectedNote = {
      id: '456',
      text: 'eome name',
      date: '1947-09-09T14:48:00.000Z',
      deleted: false,
    }
    const givenPatient = { id: 'patientId', notes: [] as Note[] } as Patient
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedNote.id)
    const expectedPatient = { ...givenPatient, notes: [expectedNote] }
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(expectedPatient)
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(givenPatient)

    const result = await executeMutation(() => useAddPatientNote(), {
      patientId: givenPatient.id,
      note: expectedNote,
    })

    expect(PatientRepository.find).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(expectedPatient)
    expect(result).toEqual([expectedNote])
  })
})
