import useDeleteIncidentNote from '../../../incidents/hooks/useDeleteIncidentNote'
import * as validateNote from '../../../patients/util/validate-note'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Note from '../../../shared/model/Note'
import { expectOneConsoleError } from '../../test-utils/console.utils'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use delete incident note', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should delete an existing note', async () => {
    const givenNote = {
      id: '5678',
      text: 'some text',
    } as Note

    const givenIncident = {
      id: '1234',
      date: new Date().toISOString(),
      notes: [givenNote] as Note[],
    } as Incident

    const expectedIncident = { ...givenIncident, notes: [] } as Incident
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(givenIncident)
    jest.spyOn(IncidentRepository, 'saveOrUpdate').mockResolvedValue(expectedIncident)

    const result = await executeMutation(() => useDeleteIncidentNote(), {
      incidentId: givenIncident.id,
      note: givenNote,
    })

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.saveOrUpdate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        notes: [expect.objectContaining({ text: givenNote.text })],
      }),
    )
    expect(result).toEqual([])
  })

  it('should throw an error if note validation fails', async () => {
    const expectedError = { nameError: 'some error' }
    expectOneConsoleError(expectedError)
    jest.spyOn(validateNote, 'default').mockReturnValue(expectedError)
    jest.spyOn(IncidentRepository, 'saveOrUpdate')

    try {
      await executeMutation(() => useDeleteIncidentNote(), {
        incidentId: '1234',
        note: {} as Note,
      })
    } catch (e) {
      expect(e).toEqual(expectedError)
    }

    expect(IncidentRepository.saveOrUpdate).not.toHaveBeenCalled()
  })
})
