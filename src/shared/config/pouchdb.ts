/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */
import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import PouchdbFind from 'pouchdb-find'
import RelationalPouch from 'relational-pouch'

const memoryAdapter = require('pouchdb-adapter-memory')
const search = require('pouchdb-quick-search')

PouchDB.plugin(search)
PouchDB.plugin(memoryAdapter)
PouchDB.plugin(RelationalPouch)
PouchDB.plugin(PouchdbFind)
PouchDB.plugin(PouchAuth)

let serverDb
let localDb

if (process.env.NODE_ENV === 'test') {
  serverDb = new PouchDB('hospitalrun', { skip_setup: true, adapter: 'memory' })
  localDb = new PouchDB('local_hospitalrun', { skip_setup: true, adapter: 'memory' })
} else {
  serverDb = new PouchDB(`${process.env.REACT_APP_HOSPITALRUN_API}/hospitalrun`, {
    skip_setup: true,
  })

  localDb = new PouchDB('local_hospitalrun', { skip_setup: true })
  localDb.sync(serverDb, { live: true, retry: true })
}

export const schema = [
  {
    singular: 'patient',
    plural: 'patients',
    relations: {
      appointments: {
        hasMany: { type: 'appointment', options: { queryInverse: 'patient', async: true } },
      },
      labs: { hasMany: { type: 'lab', options: { queryInverse: 'patient', async: true } } },
      medications: {
        hasMany: { type: 'medication', options: { queryInverse: 'patient', async: true } },
      },
      imagings: { hasMany: { type: 'imaging', options: { queryInverse: 'patient', async: true } } },
    },
  },
  {
    singular: 'appointment',
    plural: 'appointments',
    relations: { patient: { belongsTo: 'patient' } },
  },
  {
    singular: 'incident',
    plural: 'incidents',
  },
  {
    singular: 'lab',
    plural: 'labs',
    relations: { patient: { belongsTo: 'patient' } },
  },
  {
    singular: 'imaging',
    plural: 'imagings',
    relations: { patient: { belongsTo: 'patient' } },
  },
  {
    singular: 'medication',
    plural: 'medications',
    relations: { patient: { belongsTo: 'patient' } },
  },
]
export const relationalDb = localDb.setSchema(schema)
export const remoteDb = serverDb as PouchDB.Database
