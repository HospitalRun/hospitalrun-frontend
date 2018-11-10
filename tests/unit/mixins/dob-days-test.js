import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import DOBDays from 'hospitalrun/mixins/dob-days';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DS from 'ember-data';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import moment from 'moment';

module('Unit | Mixin | dob-days', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.subject = function(attrs) {
      let subject;
      run(() => {
        let Test = DS.Model.extend(DOBDays);
        this.owner.register('model:test', Test);
        subject = this.store().createRecord('test', attrs);
      });

      return subject;
    };

    this.store = function() {
      return this.owner.lookup('service:store');
    };
  });

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // Inject i18n as the intializer does not run in unit test
    this.owner.inject('model', 'i18n', 'service:i18n');

    // register t helper
    this.owner.register('helper:t', tHelper);

    // eslint-disable-next-line no-undef
    timekeeper.freeze(new Date(1481784419830));
  });

  hooks.afterEach(function() {
    // eslint-disable-next-line no-undef
    timekeeper.reset();
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
});
