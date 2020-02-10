import PouchDB from 'pouchdb'

/* eslint-disable */
const memoryAdapter = require('pouchdb-adapter-memory')
const search = require('pouchdb-quick-search')
import PouchdbFind from 'pouchdb-find'
/* eslint-enable */

PouchDB.plugin(search)
PouchDB.plugin(memoryAdapter)
PouchDB.plugin(PouchdbFind)

function createDb(name: string) {
  if (process.env.NODE_ENV === 'test') {
    return new PouchDB(name, { adapter: 'memory' })
  }

  const db = new PouchDB(name)
  db.sync(`${process.env.REAC_APP_HOSPITALRUN_SERVER}/_db/${name}`, {
    live: true,
    retry: true,
  }).on('change', (info) => {
    console.log(info)
  })

  return db
}

export const patients = createDb('patients')
export const appointments = createDb('appointments')
