import PouchDB from 'pouchdb'

/* eslint-disable */
const memoryAdapter = require('pouchdb-adapter-memory')
const search = require('pouchdb-quick-search')
import RelationalPouch from 'relational-pouch';
import PouchdbFind from 'pouchdb-find'
/* eslint-enable */

PouchDB.plugin(search).plugin(memoryAdapter).plugin(RelationalPouch).plugin(PouchdbFind)

const db = new PouchDB('hospitalrun')
const relDb = db.setSchema([
  {
    singular: 'appointment',
    plural: 'appointments',
    relations: {
      patient: { belongsTo: 'patient' },
    },
  },
  {
    singular: 'incident',
    plural: 'incidents',
  },
  {
    singular: 'lab',
    plural: 'labs',
    relations: {
      patient: { belongsTo: 'patient' },
    },
  },
  {
    singular: 'patient',
    plural: 'patients',
  },
])

export default relDb
