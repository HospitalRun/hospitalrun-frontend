import Ember from 'ember';
import { authenticateSession } from 'hospitalrun/tests/helpers/ember-simple-auth';
import { invalidateSession } from 'hospitalrun/tests/helpers/ember-simple-auth';

const {
  merge
} = Ember;

Ember.Test.registerHelper('authenticateUser', function(app, attrs = {}) {
  let expiresAt = new Date().getTime() + 600000;
  // let name = attrs.name || 'hradmin';
  // let prefix = attrs.prefix || 'p1';
  authenticateSession(app, merge({
    name: attrs.name || 'hradmin',
    roles: ['System Administrator', 'admin', 'user'],
    expires_at: expiresAt,
    role: 'System Administrator',
    prefix: attrs.prefix || 'p1'
  }, attrs));
});

Ember.Test.registerHelper('invalidateSession', function(app) {
  invalidateSession(app);
});
