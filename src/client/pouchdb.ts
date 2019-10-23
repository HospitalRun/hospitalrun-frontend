import PouchDB from 'pouchdb';

const db = new PouchDB('hospitalrun');

export async function deleteDocument(document: any) {
  return db.remove(document);
}

export async function deleteDocumentById(id: string, revId: string) {
  return db.remove(id, revId);
}

export async function saveOrUpdate(document: any) {
  try {
    const existingDocument = await get(document._id);
    const updatedDcoument = {
      _id: existingDocument._id,
      _rev: existingDocument._rev,
      ...document
    }
    return db.put(updatedDcoument)
  } catch(error) {
    if(error.status === 404) {
      return save(document)
    }
  }
}

export async function save(document: any) {
  await db.post(document);
}

export async function get(id: string) {
  const document = await db.get(id);
  return document;
}
