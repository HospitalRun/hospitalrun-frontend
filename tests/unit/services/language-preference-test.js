import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const config = Ember.Service.extend({
  configDB: {
    current_user: {
      value: 'hradmin'
    },
    preferences: {
      hradmin: {
        i18n: 'en'
      }
    },
    put(preferences) {
      this.preferences = preferences;
    }
  }
});

const i18n = Ember.Service.extend({
  locales: ['en', 'fr'],
  t() {
    return 'Select Language';
  },
  get() {
    return this.locales;
  }
});

moduleFor('service:language-preference', 'Unit | Service | language preference', {
  needs: ['service:i18n', 'service:config'],
  beforeEach() {
    this.register('service:i18n', i18n);
    this.inject.service('i18n', { as: 'i18n' });
    this.register('service:config', config);
    this.inject.service('config', { as: 'config' });
  }

});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
