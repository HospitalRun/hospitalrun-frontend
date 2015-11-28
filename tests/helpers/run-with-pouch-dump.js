/* jshint ignore:start */
import Ember from 'ember';
import PouchDB from 'pouchdb';
import DatabaseService from 'hospitalrun/services/database';
import ConfigService from 'hospitalrun/services/config';

function destroyDatabases(dbs) {
  const destroy = function(db) {
    const deferred = Ember.RSVP.defer();
    Ember.run.later(function() {
      db.on('destroyed', function() {
        deferred.resolve();
      });
      db.destroy();
    }, 100);
    return deferred.promise;
  };

  return wait().then(function() {
    return Ember.RSVP.all([destroy(dbs.config), destroy(dbs.main)]);
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

  /* The following is needed for Ember 2.x
  app.__deprecatedInstance__.register('service:config', InMemoryConfigService);
  app.__deprecatedInstance__.register('service:database', InMemoryDatabaseService);
  */

  app.registry.resolve('service:config');
  app.__container__._registry._resolveCache['service:config'] = InMemoryConfigService;

  app.registry.resolve('service:database');
  app.__container__._registry._resolveCache['service:database'] = InMemoryDatabaseService;

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
