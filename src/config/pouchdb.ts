import PouchDB from 'pouchdb'

/* eslint-disable */
const memoryAdapter = require('pouchdb-adapter-memory')
const search = require('pouchdb-quick-search')
const relationalPouch = require('relational-pouch')
import PouchdbFind from 'pouchdb-find'
import PouchAuth from 'pouchdb-authentication'
/* eslint-enable */

PouchDB.plugin(search)
PouchDB.plugin(memoryAdapter)
PouchDB.plugin(relationalPouch)
PouchDB.plugin(PouchdbFind)
PouchDB.plugin(PouchAuth)

export const remoteDb = new PouchDB(`${process.env.REACT_APP_HOSPITALRUN_API}/hospitalrun`, {
  skip_setup: true,
})

export const localDb = new PouchDB('local_hospitalrun')
localDb
  .sync(remoteDb, { live: true, retry: true })
  .on('change', (info) => {
    console.log(info)
  })
  .on('error', (info) => {
    console.error(info)
  })
