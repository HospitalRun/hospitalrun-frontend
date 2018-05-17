import { merge } from '@ember/polyfills';
import { getContext } from '@ember/test-helpers';
import {
  authenticateSession,
  invalidateSession as _invalidateSession
} from 'hospitalrun/tests/helpers/ember-simple-auth';

export function authenticateUser(attrs = {}) {
  let expiresAt = new Date().getTime() + 600000;
  authenticateSession(getContext().application, merge({
    name: 'hradmin',
    roles: ['System Administrator', 'admin', 'user'],
    expires_at: expiresAt,
    role: 'System Administrator',
    prefix: 'p1'
  }, attrs));
}

export function invalidateSession() {
  _invalidateSession(getContext().application);
}
