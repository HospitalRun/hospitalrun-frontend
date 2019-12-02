import Patient from '../../model/Patient'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'

export class PatientRepsitory extends Repository<Patient> {
  constructor() {
    super(patients)
  }
}

export default new PatientRepsitory()
