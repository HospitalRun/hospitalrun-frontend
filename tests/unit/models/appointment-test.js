import { moduleForModel } from 'ember-qunit';
import moment from 'moment';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleForModel('appointment', 'Unit | Model | appointment', {
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'model:patient',
    'model:visit',
    'service:session'
  ]
});

testValidPropertyValues('appointmentType', ['test']);
testInvalidPropertyValues('appointmentType', [undefined]);

let today = moment().startOf('day').toDate();
let tomorrow =  moment().startOf('day').add(24, 'hours').toDate();

testValidPropertyValues('startDate', [today], function(subject) {
  Ember.run(() => { subject.set('endDate', tomorrow) });
});

testInvalidPropertyValues('startDate', [tomorrow], function(subject) {
  Ember.run(() => { subject.set('endDate', today) });
});

testValidPropertyValues('endDate', [tomorrow], function(subject) {
  Ember.run(() => { subject.set('startDate', today) });
});

testInvalidPropertyValues('endDate', [today], function(subject) {
  Ember.run(() => { subject.set('startDate', tomorrow) });
});

testInvalidPropertyValues('startDate', [today], function(subject) {
  Ember.run(() => {
  	subject.set('allDay', false);
    subject.set('endDate', today);
  });
});

testValidPropertyValues('startDate', [today], function(subject) {
  Ember.run(() => {
  	subject.set('allDay', true);
    subject.set('endDate', today);
  });
});
