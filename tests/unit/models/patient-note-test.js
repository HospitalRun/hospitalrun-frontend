import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

moduleForModel('patient-note', 'Unit | Model | patient-note', {
  needs: [
    'ember-validations@validator:local/presence',
    'service:i18n',
    'service:session',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment',
    'model:patient',
    'model:visit'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:i18n').set('locale', 'en');
    this.registry.register('locale:en/config', localeConfig);

    // manually inject the i18n service as initialzer does not run
    // in unit test
    Ember.getOwner(this).inject('model', 'i18n', 'service:i18n');

    // register t helper
    this.registry.register('helper:t', tHelper);
  }
});

test('authoredBy', function(assert) {
  let patientNote = this.subject({
    createdBy: 'Test Person'
  });

  assert.strictEqual(patientNote.get('authoredBy'), 'Test Person');
});

test('authoredBy', function(assert) {
  let patientNote = this.subject({
    createdBy: 'Test Person',
    attribution: 'Test Organization'
  });

  assert.strictEqual(patientNote.get('authoredBy'), 'Test Person on behalf of Test Organization');
});
