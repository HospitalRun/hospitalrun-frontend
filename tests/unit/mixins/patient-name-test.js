import PatientName from 'hospitalrun/mixins/patient-name';
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';

moduleFor('mixin:patient-name', 'Unit | Mixin | patient-name', {
  needs: [
    'ember-validations@validator:local/format',
    'ember-validations@validator:local/presence',
    'model:allergy',
    'model:diagnosis',
    'model:operation-report',
    'model:operative-plan',
    'model:patient',
    'model:payment',
    'model:price-profile',
    'service:session'
  ],
  subject(attrs) {
    let subject;
    Ember.run(() => {
      let Test = DS.Model.extend(PatientName);
      this.register('model:test', Test);
      subject = this.store().createRecord('test', attrs);
    });

    return subject;
  },
  store() {
    return this.container.lookup('service:store');
  }
});

test('getPatientDisplayId friendlyId', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      friendlyId: 'test',
      id: '123'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayId(patient), 'test');
});

test('getPatientDisplayId externalPatientId', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      externalPatientId: '1234',
      id: '4321'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayId(patient), '1234');
});

test('getPatientDisplayId id', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      id: '9876'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayId(patient), '9876');
});

test('getPatientDisplayName', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      firstName: 'First',
      lastName: 'Last',
      middleName: 'Middle'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayName(patient), 'First Middle Last');
});

test('getPatientDisplayName first', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      firstName: 'First'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayName(patient), 'First');
});

test('getPatientDisplayName first and last', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      firstName: 'First',
      lastName: 'Last'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayName(patient), 'First Last');
});

test('getPatientDisplayName last', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      lastName: 'Last'
    });
  });

  assert.strictEqual(this.subject().getPatientDisplayName(patient), 'Last');
});
