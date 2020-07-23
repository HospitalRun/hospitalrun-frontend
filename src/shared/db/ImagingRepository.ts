import { relationalDb } from '../config/pouchdb'
import Imaging from '../model/Imaging'
import generateCode from '../util/generateCode'
import Repository from './Repository'

class ImagingRepository extends Repository<Imaging> {
  constructor() {
    super('imaging', relationalDb)
  }

  async save(entity: Imaging): Promise<Imaging> {
    const imagingCode = generateCode('I')
    entity.code = imagingCode
    return super.save(entity)
  }
}

export default new ImagingRepository()
