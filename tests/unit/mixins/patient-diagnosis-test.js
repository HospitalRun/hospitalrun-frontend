import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import { moduleFor, test } from 'ember-qunit';

const DIAGNOSIS_PROPERTIES = ['active', 'date', 'diagnosis', 'secondaryDiagnosis'];

function diagnosesDump(diagnoses) {
  return diagnoses.map((diagnosis) => {
    return diagnosis.getProperties(DIAGNOSIS_PROPERTIES);
  });
}

moduleFor('mixin:patient-diagnosis', 'Unit | Mixin | patient-diagnosis', {
  needs: [
    'model:visit',
    'model:proc-charge',
    'model:patient',
    'model:vital',
    'model:imaging',
    'model:lab',
    'model:medication',
    'model:patient-note',
    'model:procedure',
    'model:diagnosis',
    'model:report',
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'service:session'
  ],
  store() {
    return this.container.lookup('service:store');
  },
  getVisitData() {
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
  }
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
