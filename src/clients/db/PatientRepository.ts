import Patient from '../../model/Patient'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'

export class PatientRepository extends Repository<Patient> {
  constructor() {
    super(patients)
  }
}

export default new PatientRepository()
