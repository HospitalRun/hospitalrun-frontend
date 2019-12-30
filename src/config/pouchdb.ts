import PouchDB from 'pouchdb'

// eslint-disable-next-line
const memoryAdapter = require('pouchdb-adapter-memory')

PouchDB.plugin(memoryAdapter)

function createDb(name: string) {
  if (process.env.NODE_ENV === 'test') {
    return new PouchDB(name, { adapter: 'memory' })
  }

  const db = new PouchDB(name)
  // db.sync(
  //   `https://a27fa3db-db4d-4456-8465-da953aee0f5b-bluemix:cd6f332d39f24d2b7cfc89d82f6836d46012ef3188698319b0d5fff177cb2ddc@a27fa3db-db4d-4456-8465-da953aee0f5b-bluemix.cloudantnosqldb.appdomain.cloud/${name}`,
  //   {
  //     live: true,
  //     retry: true,
  //   },
  // ).on('change', (info) => {
  //   console.log(info)
  // })

  return db
}

export const patients = createDb('patients')
