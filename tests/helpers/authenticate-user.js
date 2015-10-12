import Ember from 'ember';
const {
  merge,
  setProperties
} = Ember;

Ember.Test.registerHelper('authenticateUser', function(app, attrs = {}) {
  authenticateSession();
  andThen(function() {
    const secure = currentSession().get('secure');
    setProperties(secure, merge({
      authenticator: 'authenticator:custom',
      ok: true,
      name: 'hradmin',
      roles: ['System Administrator','admin','user'],
      expires_at: 1443727594804,
      role: 'System Administrator',
      prefix: 'p1'
    }, attrs));
  });
});
