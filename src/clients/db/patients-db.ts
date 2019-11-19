import { patients } from '../../config/pouchdb'
import Patient from 'model/Patient';

function mapRowToPatient(row: any): Patient {
  return new Patient(row.id, row.value.rev, row.doc.firstName, row.doc.lastName);
}

function mapDocumentToPatient(document: any): Patient {
  return new Patient(document._id, document._rev, document.firstName, document.lastName);
}

export async function getAll(): Promise<Patient[]> {
  const allPatients = await patients.allDocs({
    include_docs: true,
  });

 return allPatients.rows.map(r => {
  const row = r as any;
  return mapRowToPatient(row)
 });
}

export async function deleteDocument(document: any) {
  return patients.remove(document)
}

export async function deleteDocumentById(id: string, revId: string) {
  return patients.remove(id, revId)
}

export async function saveOrUpdate(patient: Patient) {
  try {
    // try and get a patient, if the patient is missing it will throw an error
    // and have a status of 404.
    await patients.get(patient.id)
    const { id, rev, ...restOfPatient} = patient;
    const updatedDcoument = {
      _id: id,
      _rev: rev,
      ...restOfPatient,
    }

    return patients.put(updatedDcoument)
  } catch (error) {
    if (error.status !== 404) {
      throw Error(error);
    }

    return save(patient)
  }
}

export async function save(patient: Patient): Promise<Patient> {
  const newPatient = await patients.post(patient)
  return get(newPatient.id);
}

export async function get(id: string): Promise<Patient> {
  const document = await patients.get(id)
  return mapDocumentToPatient(document as any);
}
