import Ember from 'ember';
import {authenticateSession} from 'hospitalrun/tests/helpers/ember-simple-auth';
import {invalidateSession} from 'hospitalrun/tests/helpers/ember-simple-auth';

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
    }, attrs)
  );
});

Ember.Test.registerHelper('invalidateSession', function(app) {
  invalidateSession(app);
});
