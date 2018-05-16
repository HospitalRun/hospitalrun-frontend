<<<<<<< HEAD
import Ember from 'ember';
import { authenticateSession } from 'hospitalrun/tests/helpers/ember-simple-auth';
import { invalidateSession } from 'hospitalrun/tests/helpers/ember-simple-auth';

const {
  merge
} = Ember;

Ember.Test.registerHelper('authenticateUser', function(app, attrs = {}) {
  let expiresAt = new Date().getTime() + 600000;
  authenticateSession(app, merge({
    name: 'hradmin',
    roles: ['System Administrator', 'admin', 'user'],
    expires_at: expiresAt,
    role: 'System Administrator',
    prefix: 'p1'
  }, attrs));
});

Ember.Test.registerHelper('invalidateSession', function(app) {
  invalidateSession(app);
});
=======
import { registerHelper } from '@ember/test';
import { merge } from '@ember/polyfills';
import { authenticateSession } from 'hospitalrun/tests/helpers/ember-simple-auth';
import { invalidateSession } from 'hospitalrun/tests/helpers/ember-simple-auth';

registerHelper('authenticateUser', function(app, attrs = {}) {
  let expiresAt = new Date().getTime() + 600000;
  authenticateSession(app, merge({
    name: 'hradmin',
    roles: ['System Administrator', 'admin', 'user'],
    expires_at: expiresAt,
    role: 'System Administrator',
    prefix: 'p1'
  }, attrs));
});

registerHelper('invalidateSession', function(app) {
  invalidateSession(app);
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
