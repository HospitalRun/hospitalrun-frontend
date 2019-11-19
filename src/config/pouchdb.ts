import PouchDB from 'pouchdb'

export const patients = new PouchDB('patients')
PouchDB.sync(
  'patients',
  'https://a27fa3db-db4d-4456-8465-da953aee0f5b-bluemix:cd6f332d39f24d2b7cfc89d82f6836d46012ef3188698319b0d5fff177cb2ddc@a27fa3db-db4d-4456-8465-da953aee0f5b-bluemix.cloudantnosqldb.appdomain.cloud/patients',
  {
    live: true,
    retry: true,
  },
).on('change', (info) => {
  // handle change
  console.log(info)
})
