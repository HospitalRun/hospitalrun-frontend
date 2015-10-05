import Ember from 'ember';

const {
  on
} = Ember;

function destroyDatabases(app) {
  const databaseService = app.registry.lookup('service:database');
  const db = databaseService.get('mainDB');
  const promise = Ember.RSVP.defer();
  db.on('destroyed', function(){
    promise.resolve();
  });
  on(app, 'willDestroy', function(){
    db.destroy();
  });
  return promise;
}

Ember.Test.registerAsyncHelper('destroyDatabases', destroyDatabases);
