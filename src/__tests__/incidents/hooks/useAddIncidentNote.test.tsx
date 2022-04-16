import useAddIncidentNote from '../../../incidents/hooks/useAddIncidentNote'
import IncidentRepository from '../../../shared/db/IncidentRepository'
import Incident from '../../../shared/model/Incident'
import Note from '../../../shared/model/Note'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use add incident note', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should add a new note', async () => {
    const expectedNote = {
      id: '5678',
      text: 'some text',
    } as Note

    const givenIncident = {
      id: '1234',
      date: new Date().toISOString(),
      notes: [] as Note[],
    } as Incident

    const expectedIncident = { ...givenIncident, notes: [expectedNote] } as Incident
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(givenIncident)
    jest.spyOn(IncidentRepository, 'saveOrUpdate').mockResolvedValue(expectedIncident)

    const result = await executeMutation(() => useAddIncidentNote(), {
      incidentId: givenIncident.id,
      note: expectedNote,
    })

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.saveOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: [expect.objectContaining({ text: expectedNote.text })],
      }),
    )
    expect(result).toEqual([expectedNote])
  })

  it('should edit an existing note', async () => {
    const givenNote = {
      id: '5678',
      text: 'some new text',
    } as Note

    const expectedNote = {
      id: '5678',
      text: 'some edited text',
    } as Note

    const givenIncident = {
      id: '1234',
      date: new Date().toISOString(),
      notes: [givenNote] as Note[],
    } as Incident

    const expectedIncident = { ...givenIncident, notes: [expectedNote] } as Incident
    jest.spyOn(IncidentRepository, 'find').mockResolvedValue(givenIncident)
    jest.spyOn(IncidentRepository, 'saveOrUpdate').mockResolvedValue(expectedIncident)

    const result = await executeMutation(() => useAddIncidentNote(), {
      incidentId: givenIncident.id,
      note: expectedNote,
    })

    expect(IncidentRepository.find).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(IncidentRepository.saveOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: [expect.objectContaining({ text: expectedNote.text })],
      }),
    )
    expect(IncidentRepository.saveOrUpdate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        notes: [expect.objectContaining({ text: givenNote.text })],
      }),
    )
    expect(result).toEqual([expectedNote])
  })
})
