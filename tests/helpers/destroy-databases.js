import Ember from 'ember';

function destroyDatabases(app) {
  const databaseService = app.registry.lookup('service:database');
  const configService = app.registry.lookup('service:config');

  const config = configService.get('configDB');
  const db = databaseService.get('mainDB');

  const destroy = function(db) {
    const deferred = Ember.RSVP.defer();
    Ember.run.later(function(){
      db.on('destroyed', function(){
        deferred.resolve();
      });
      db.destroy();
    }, 100);
    return deferred.promise;
  };

  return wait().then(function(){
    return Ember.RSVP.all([destroy(config), destroy(db)]);
  });
}

Ember.Test.registerAsyncHelper('destroyDatabases', destroyDatabases);
