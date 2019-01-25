import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const DIAGNOSIS_PROPERTIES = ['active', 'date', 'diagnosis', 'secondaryDiagnosis'];

function diagnosesDump(diagnoses) {
  return diagnoses.map((diagnosis) => {
    return diagnosis.getProperties(DIAGNOSIS_PROPERTIES);
  });
}

module('Unit | Mixin | patient-diagnosis', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = function() {
      return this.owner.lookup('service:store');
    };

    this.getVisitData = function() {
      return run(() => {
        let visitDate = new Date(1393822800000);
        return this.store().createRecord('visit', {
          startDate: visitDate,
          diagnoses: [{
            diagnosis: 'primary one',
            date: visitDate
          }, {
            active: false,
            date: new Date(1372822800000),
            diagnosis: 'primary two'
          }, {
            diagnosis: 'additional diag one a',
            secondaryDiagnosis: true,
            date: visitDate,
            active: true
          }, {
            diagnosis: 'additional diag one b',
            secondaryDiagnosis: true,
            date: visitDate,
            active: false
          }].map((diagnosis) => this.store().createRecord('diagnosis', diagnosis))
        });
      });
    };
  });

  test('get active primary diagnoses', function(assert) {
    let patientDiagnosis = EmberObject.extend(PatientDiagnosis).create();
    let visit = this.getVisitData();
    let diagnosesList = patientDiagnosis.getDiagnoses(visit, true, false);
    assert.deepEqual(diagnosesDump(diagnosesList), [{
      active: true,
      date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
      diagnosis: 'primary one',
      secondaryDiagnosis: false
    }], 'Only active primary diagnoses are returned', assert);
  });

  test('get all primary diagnoses', function(assert) {
    let patientDiagnosis = EmberObject.extend(PatientDiagnosis).create();
    let visit = this.getVisitData();
    let diagnosesList = patientDiagnosis.getDiagnoses(visit, false, false);
    assert.deepEqual(diagnosesDump(diagnosesList), [{
      active: true,
      date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
      diagnosis: 'primary one',
      secondaryDiagnosis: false
    }, {
      active: false,
      date: new Date('Tue Jul 02 2013 23:40:00 GMT-0400 (EDT)'),
      diagnosis: 'primary two',
      secondaryDiagnosis: false
    }], 'All primary diagnoses are returned', assert);
  });

  test('get active secondary diagnoses', function(assert) {
    let patientDiagnosis = EmberObject.extend(PatientDiagnosis).create();
    let visit = this.getVisitData();
    let diagnosesList = patientDiagnosis.getDiagnoses(visit, true, true);
    assert.deepEqual(diagnosesDump(diagnosesList), [
      {
        active: true,
        date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
        diagnosis: 'additional diag one a',
        secondaryDiagnosis: true
      }
    ], 'Only active secondary diagnoses are returned');
  });

  test('get all secondary diagnoses', function(assert) {
    let patientDiagnosis = EmberObject.extend(PatientDiagnosis).create();
    let visit = this.getVisitData();
    let diagnosesList = patientDiagnosis.getDiagnoses(visit, false, true);
    assert.deepEqual(diagnosesDump(diagnosesList), [
      {
        active: true,
        date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
        diagnosis: 'additional diag one a',
        secondaryDiagnosis: true
      },
      {
        active: false,
        date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
        diagnosis: 'additional diag one b',
        secondaryDiagnosis: true
      }
    ], 'All secondary diagnoses are returned');
  });
});
