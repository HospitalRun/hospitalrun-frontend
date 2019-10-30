import { patients } from '../../config/pouchdb';

export async function getAll() {
  return patients.allDocs({ include_docs: true});
}

export async function deleteDocument(document: any) {
  return patients.remove(document);
}

export async function deleteDocumentById(id: string, revId: string) {
  return patients.remove(id, revId);
}

export async function saveOrUpdate(document: any) {
  try {
    const existingDocument = await get(document._id);
    const updatedDcoument = {
      _id: existingDocument._id,
      _rev: existingDocument._rev,
      ...document
    }
    return patients.put(updatedDcoument)
  } catch(error) {
    if(error.status === 404) {
      return save(document)
    }
  }

  return null;
}

export async function save(document: any) {
  return patients.post(document);
}

export async function get(id: string) {
  const document = await patients.get(id);
  return document;
}