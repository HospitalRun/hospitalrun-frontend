import PouchDB from 'pouchdb'

/* eslint-disable */
const memoryAdapter = require('pouchdb-adapter-memory')
const search = require('pouchdb-quick-search')
import RelationalPouch from 'relational-pouch'
import PouchdbFind from 'pouchdb-find'
import PouchAuth from 'pouchdb-authentication'
/* eslint-enable */

PouchDB.plugin(search)
PouchDB.plugin(memoryAdapter)
PouchDB.plugin(RelationalPouch)
PouchDB.plugin(PouchdbFind)
PouchDB.plugin(PouchAuth)

export const remoteDb = new PouchDB(`${process.env.REACT_APP_HOSPITALRUN_API}/hospitalrun`, {
  skip_setup: true,
})

const localDb = new PouchDB('local_hospitalrun')
localDb
  .sync(remoteDb, { live: true, retry: true })
  .on('change', (info) => {
    console.log(info)
  })
  .on('error', (info) => {
    console.error(info)
  })

export const schema = [
  {
    singular: 'patient',
    plural: 'patients',
    relations: {
      appointments: {
        hasMany: { type: 'appointment', options: { queryInverse: 'patient', async: true } },
      },
      labs: { hasMany: { type: 'lab', options: { queryInverse: 'patient', async: true } } },
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
]

export const relationalDb = localDb.setSchema(schema)
