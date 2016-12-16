import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

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
    'model:procedure'
  ],
  store() {
    return this.container.lookup('service:store');
  },
  getVisitsData() {
    return Ember.run(() => {
      return [
        {
          startDate: new Date(1393822800000),
          primaryDiagnosis: 'primary one',
          primaryBillingDiagnosis: 'primary billing one',
          additionalDiagnoses: [
            { description: 'additional diag one a' },
            { description: 'additional diag one b' }
          ]
        },
        {
          startDate: new Date(1372822800000),
          primaryDiagnosis: 'primary two',
          primaryBillingDiagnosis: 'primary billing two',
          additionalDiagnoses: [
            { description: 'additional diag two' }
          ]
        }
      ].map((visit) => this.store().createRecord('visit', visit));
    });
  }
});

test('getPrimaryDiagnoses', function(assert) {
  let patientDiagnosis = Ember.Object.extend(PatientDiagnosis).create();
  let visits = this.getVisitsData();
  let diagnosesList = patientDiagnosis.getPrimaryDiagnoses(visits);

  assert.deepEqual(diagnosesList, [
    {
      date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
      description: 'primary one',
      first: true
    },
    {
      date: new Date('Mon Mar 03 2014 00:00:00 GMT-0500 (EST)'),
      description: 'primary billing one'
    },
    {
      date: new Date('Tue Jul 02 2013 23:40:00 GMT-0400 (EDT)'),
      description: 'primary two'
    },
    {
      date: new Date('Tue Jul 02 2013 23:40:00 GMT-0400 (EDT)'),
      description: 'primary billing two'
    }
  ]);
});

test('getSecondaryDiagnosis', function(assert) {
  let patientDiagnosis = Ember.Object.extend(PatientDiagnosis).create();
  let visits = this.getVisitsData();
  let diagnosesList = patientDiagnosis.getSecondaryDiagnoses(visits);

  assert.deepEqual(diagnosesList, [
    {
      description: 'additional diag one a',
      first: true
    },
    {
      description: 'additional diag one b'
    },
    {
      description: 'additional diag two'
    }
  ]);
});
