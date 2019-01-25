import { run } from '@ember/runloop';
import PatientName from 'hospitalrun/mixins/patient-name';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DS from 'ember-data';

module('Unit | Mixin | patient-name', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.subject = function(attrs) {
      let subject;
      run(() => {
        let Test = DS.Model.extend(PatientName);
        this.owner.register('model:test', Test);
        subject = this.store().createRecord('test', attrs);
      });

      return subject;
    };

    this.store = function() {
      return this.owner.lookup('service:store');
    };
  });

  test('getPatientDisplayId friendlyId', function(assert) {
    let patient;
    run(() => {
      patient = this.store().createRecord('patient', {
        friendlyId: 'test',
        id: '123'
      });
    });

    assert.strictEqual(this.subject().getPatientDisplayId(patient), 'test');
  });

  test('getPatientDisplayId externalPatientId', function(assert) {
    let patient;
    run(() => {
      patient = this.store().createRecord('patient', {
        externalPatientId: '1234',
        id: '4321'
      });
    });

    assert.strictEqual(this.subject().getPatientDisplayId(patient), '1234');
  });

  test('getPatientDisplayId id', function(assert) {
    let patient;
    run(() => {
      patient = this.store().createRecord('patient', {
        id: '9876'
      });
    });

    assert.strictEqual(this.subject().getPatientDisplayId(patient), '9876');
  });

  test('getPatientDisplayName', function(assert) {
    let patient;
    run(() => {
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
    run(() => {
      patient = this.store().createRecord('patient', {
        firstName: 'First'
      });
    });

    assert.strictEqual(this.subject().getPatientDisplayName(patient), 'First');
  });

  test('getPatientDisplayName first and last', function(assert) {
    let patient;
    run(() => {
      patient = this.store().createRecord('patient', {
        firstName: 'First',
        lastName: 'Last'
      });
    });

    assert.strictEqual(this.subject().getPatientDisplayName(patient), 'First Last');
  });

  test('getPatientDisplayName last', function(assert) {
    let patient;
    run(() => {
      patient = this.store().createRecord('patient', {
        lastName: 'Last'
      });
    });

    assert.strictEqual(this.subject().getPatientDisplayName(patient), 'Last');
  });
});
