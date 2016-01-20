/* jshint ignore:start */
import Ember from 'ember';
import PouchDB from 'pouchdb';
import DatabaseService from 'hospitalrun/services/database';
import ConfigService from 'hospitalrun/services/config';

function destroyDatabases(dbs) {
  return wait().then(function() {
    let destroyQueue = [];
    destroyQueue.push(dbs.config.info().then(function() {
      return dbs.config.destroy();
    }));
    destroyQueue.push(dbs.main.info().then(function() {
      return dbs.main.destroy();
    }));
    return Ember.RSVP.all(destroyQueue);
  });
}

function runWithPouchDumpAsyncHelper(app, dumpName, functionToRun) {

  const db = new PouchDB('hospitalrun-test-database', {
    adapter: 'memory'
  });
  const configDB = new PouchDB('hospitalrun-test-config-database', {
    adapter: 'memory'
  });
  const dump = require(`hospitalrun/tests/fixtures/${dumpName}`).default;
  const promise = db.load(dump, {
    proxy: 'main'
  });

  const InMemoryDatabaseService = DatabaseService.extend({
    createDB() {
      return promise.then(function() {
        return db;
      });
    }
  });

  const InMemoryConfigService = ConfigService.extend({
    createDB() {
      return Ember.RSVP.resolve(configDB);
    },
    replicateConfigDB() {

    }
  });

  app.__deprecatedInstance__.register('service:config', InMemoryConfigService);
  app.__deprecatedInstance__.register('service:database', InMemoryDatabaseService);

  return new Ember.RSVP.Promise(function(resolve) {
    promise.then(function() {
      functionToRun();
      andThen(function() {
        destroyDatabases({
          config: configDB,
          main: db
        }).then(resolve);
      });
    });
  });
}

Ember.Test.registerAsyncHelper('runWithPouchDump', runWithPouchDumpAsyncHelper);
/* jshint ignore:end */
