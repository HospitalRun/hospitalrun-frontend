import { run } from '@ember/runloop';
import DOBDays from 'hospitalrun/mixins/dob-days';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DS from 'ember-data';
import moment from 'moment';

module('Unit | Mixin | dob-days', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').set('locale', 'en');

    this.subject = function(attrs) {
      return run(() => {
        let Test = DS.Model.extend(DOBDays);
        this.owner.register('model:test', Test);
        return this.owner.lookup('service:store').createRecord('test', attrs);
      });
    };
  });

  hooks.beforeEach(function() {
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
