import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import DOBDays from 'hospitalrun/mixins/dob-days';
import { moduleFor, test } from 'ember-qunit';
import DS from 'ember-data';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import moment from 'moment';

moduleFor('mixin:dob-days', 'Unit | Mixin | dob-days', {
  needs: [
    'service:i18n',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:i18n').set('locale', 'en');
    this.registry.register('locale:en/config', localeConfig);

    // Inject i18n as the intializer does not run in unit test
    getOwner(this).inject('model', 'i18n', 'service:i18n');

    // register t helper
    this.registry.register('helper:t', tHelper);

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
