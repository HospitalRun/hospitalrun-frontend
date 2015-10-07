/* jshint ignore:start */
import Ember from 'ember';
import PouchDB from 'pouchdb';
import DatabaseService from 'hospitalrun/services/database';

const {
  on
} = Ember;

function loadPouchDumpAsyncHelper(app, dumpName) {
  let db;
  const InMemoryDatabase = DatabaseService.extend({
    createConfigDB() {
      return Ember.RSVP.resolve(new PouchDB('config', {adapter: 'memory'}));
    },
    replicateConfigDB(db) {
      return db;
    },
    createMainDB() {
      return db;
    }
  });
  app.registry.resolve('service:database');
  app.__container__._registry._resolveCache['service:database'] = InMemoryDatabase;

  on(app, 'willDestroy', function(){
    db.destroy();
    db = null;
  });

  return new Ember.RSVP.Promise(function(resolve, reject){
    db = new PouchDB('hospitalrun-test-database', {
      adapter: 'memory'
    });
    const dump = require(`hospitalrun/tests/fixtures/${dumpName}`).default;
    db.load(dump, {
      proxy: 'main',
    }).then(resolve).catch(reject);
  });
}

Ember.Test.registerAsyncHelper('loadPouchDump', loadPouchDumpAsyncHelper);
/* jshint ignore:end */
