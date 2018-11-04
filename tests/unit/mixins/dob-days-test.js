import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import DOBDays from 'hospitalrun/mixins/dob-days';
import { moduleFor, test } from 'ember-qunit';
import DS from 'ember-data';
import moment from 'moment';

moduleFor('mixin:dob-days', 'Unit | Mixin | dob-days', {
  needs: [
    'config:environment',
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

    // Inject intl as the intializer does not run in unit test
    getOwner(this).inject('model', 'intl', 'service:intl');

    // eslint-disable-next-line no-undef
    timekeeper.freeze(new Date(1481784419830));
  },
  afterEach() {
    // eslint-disable-next-line no-undef
    timekeeper.reset();
  },
  subject(attrs) {
    let subject;
    run(() => {
      let Test = DS.Model.extend(DOBDays);
      this.register('model:test', Test);
      subject = this.store().createRecord('test', attrs);
    });

    return subject;
  },
  store() {
    return this.container.lookup('service:store');
  }
});

test('convertDOBToText date object', function(assert) {
  let dobDays = this.subject();

  assert.strictEqual(dobDays.convertDOBToText(moment('January 3rd, 1995', 'LLL').toDate()).toString(), '21 years 11 months 12 days');
});

test('convertDOBToText date object with time component', function(assert) {
  let dobDays = this.subject();

  assert.strictEqual(dobDays.convertDOBToText(moment('January 3rd, 1995 6:00 AM', 'LLL').toDate()).toString(), '21 years 11 months 12 days');
});

test('convertDOBToText date string', function(assert) {
  let dobDays = this.subject();

  assert.strictEqual(dobDays.convertDOBToText('January 3rd, 1995').toString(), '21 years 11 months 12 days');
});

test('convertDOBToText date string short format', function(assert) {
  let dobDays = this.subject();

  assert.strictEqual(dobDays.convertDOBToText('January 3rd, 1995', true).toString(), '21y 11m 12d');
});

test('convertDOBToText date string omit days', function(assert) {
  let dobDays = this.subject();

  assert.strictEqual(dobDays.convertDOBToText('January 3rd, 1995', false, true).toString(), '21 years 11 months');
});
