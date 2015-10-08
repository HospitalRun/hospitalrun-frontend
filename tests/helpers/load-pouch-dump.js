/* jshint ignore:start */
import Ember from 'ember';
import PouchDB from 'pouchdb';
import DatabaseService from 'hospitalrun/services/database';
import ConfigService from 'hospitalrun/services/config';

function loadPouchDumpAsyncHelper(app, dumpName) {

  const db = new PouchDB('hospitalrun-test-database', {
    adapter: 'memory'
  });
  const dump = require(`hospitalrun/tests/fixtures/${dumpName}`).default;
  const promise = db.load(dump, {
    proxy: 'main',
  });

  const InMemoryDatabaseService = DatabaseService.extend({
    createDB() {
      return promise.then(function(){
        return db;
      });
    }
  });

  const InMemoryConfigService = ConfigService.extend({
    createDB() {
      const db = new PouchDB('hospitalrun-test-config-database', {
        adapter: 'memory'
      });
      return Ember.RSVP.resolve(db);
    },
    replicateConfigDB() {

    }
  });

  app.registry.resolve('service:config');
  app.__container__._registry._resolveCache['service:config'] = InMemoryConfigService;

  app.registry.resolve('service:database');
  app.__container__._registry._resolveCache['service:database'] = InMemoryDatabaseService;

  return promise;
}

Ember.Test.registerAsyncHelper('loadPouchDump', loadPouchDumpAsyncHelper);
/* jshint ignore:end */
