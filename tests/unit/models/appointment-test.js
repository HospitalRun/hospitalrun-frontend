import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import { getContext } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import moment from 'moment';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | appointment', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    let { owner } = getContext();

    this.subject = () => run(() => owner
      .lookup('service:store')
      .createRecord('appointment'));
  });

  testValidPropertyValues('appointmentType', ['test']);
  testInvalidPropertyValues('appointmentType', [undefined]);

  let today = moment().startOf('day').toDate();
  let tomorrow =  moment().startOf('day').add(24, 'hours').toDate();

  testValidPropertyValues('startDate', [today], function(subject) {
    run(() => {
      subject.set('endDate', tomorrow);
    });
  });

  testInvalidPropertyValues('startDate', [tomorrow], function(subject) {
    run(() => {
      subject.set('endDate', today);
    });
  });

  testValidPropertyValues('endDate', [tomorrow], function(subject) {
    run(() => {
      subject.set('startDate', today);
    });
  });

  testInvalidPropertyValues('endDate', [today], function(subject) {
    run(() => {
      subject.set('startDate', tomorrow);
    });
  });

  testInvalidPropertyValues('startDate', [today], function(subject) {
    run(() => {
      subject.set('allDay', false);
      subject.set('endDate', today);
    });
  });

  testValidPropertyValues('startDate', [today], function(subject) {
    run(() => {
      subject.set('allDay', true);
      subject.set('endDate', today);
    });
  });
});
