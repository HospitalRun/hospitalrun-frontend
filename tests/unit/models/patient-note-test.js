import { getOwner } from '@ember/application';
import { moduleForModel, test } from 'ember-qunit';
import tHelper from 'ember-intl/helpers/t';

moduleForModel('patient-note', 'Unit | Model | patient-note', {
  needs: [
    'ember-validations@validator:local/presence',
    'service:session',
    'config:environment',
    'model:patient',
    'model:visit',
    'service:intl',
    'ember-intl@adapter:default',
    'cldr:cn',
    'cldr:de',
    'cldr:en',
    'cldr:es',
    'cldr:gr',
    'cldr:hi',
    'cldr:pt',
    'cldr:th',
    'cldr:tw',
    'cldr:de',
    'cldr:es',
    'cldr:fr',
    'cldr:he',
    'cldr:it',
    'cldr:ru',
    'cldr:tr',
    'cldr:ur',
    'translation:en',
    'util:intl/missing-message'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:intl').set('locale', 'en');

    // manually inject the intl service as initialzer does not run
    // in unit test
    getOwner(this).inject('model', 'intl', 'service:intl');

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
