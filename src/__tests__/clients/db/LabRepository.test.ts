import shortid from 'shortid'
import LabRepository from '../../../clients/db/LabRepository'
import Lab from '../../../model/Lab'

describe('lab repository', () => {
  it('should generate a lab code', async () => {
    const newLab = await LabRepository.save({
      patientId: '123',
      type: 'test',
    } as Lab)

    expect(shortid.isValid(newLab.code)).toBeTruthy()
  })
})
