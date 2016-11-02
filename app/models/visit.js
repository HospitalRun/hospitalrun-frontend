import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';

function dateAcceptance(object) {
  if (!object.get('hasDirtyAttributes')) {
    return false;
  }
  let startDate = object.get('startDate');
  let endDate = object.get('endDate');
  if (Ember.isEmpty(endDate) || Ember.isEmpty(startDate)) {
    // Can't validate if empty
    return false;
  } else {
    if (endDate.getTime() < startDate.getTime()) {
      return true;
    }
  }
  return false;
}

const PAYMENT_STATES = {
  CLEAR: 'clear',
  PENDING: 'pending'
};

function paymentStateAcceptance(object) {
  return !Object.keys(PAYMENT_STATES)
      .some((state) => PAYMENT_STATES[state] === object.get('paymentState'));
}

export default AbstractModel.extend({
  additionalDiagnoses: DS.attr(), // Yes, the plural of diagnosis is diagnoses!
  charges: DS.hasMany('proc-charge', {
    async: false
  }),
  dischargeInfo: DS.attr('string'),
  endDate: DS.attr('date'), // if visit type is outpatient, startDate and endDate are equal
  examiner: DS.attr('string'),
  history: DS.attr('string'),
  historySince: DS.attr('string'), // History since last seen
  imaging: DS.hasMany('imaging', { async: true }),
  labs: DS.hasMany('lab', { async: true }),
  location: DS.attr('string'),
  medication: DS.hasMany('medication', { async: true }),
  // this field is being deprecated in favor of patient-note
  notes: DS.attr('string'),
  patientNotes: DS.hasMany('patient-note', { async: true }),
  outPatient: DS.attr('boolean'),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  paymentState: DS.attr('string', { defaultValue: PAYMENT_STATES.PENDING }),
  primaryDiagnosis: DS.attr('string'), // AKA admitting diagnosis
  primaryBillingDiagnosis: DS.attr('string'), // AKA final diagnosis
  primaryBillingDiagnosisId: DS.attr('string'),
  procedures: DS.hasMany('procedure', { async: true }),
  startDate: DS.attr('date'),
  status: DS.attr('string'),
  visitType: DS.attr(),
  vitals: DS.hasMany('vital', { async: true }),

  diagnosisList: function() {
    let additionalDiagnosis = this.get('additionalDiagnoses');
    let diagnosisList = [];
    let primaryDiagnosis = this.get('primaryDiagnosis');
    if (!Ember.isEmpty(primaryDiagnosis)) {
      diagnosisList.push(primaryDiagnosis);
    }
    if (!Ember.isEmpty(additionalDiagnosis)) {
      diagnosisList.addObjects(additionalDiagnosis.map(function(diagnosis) {
        return diagnosis.description;
      }));
    }
    return diagnosisList;
  }.property('additionalDiagnosis.[]', 'primaryDiagnosis'),

  visitDate: function() {
    let endDate = this.get('endDate');
    let startDate = moment(this.get('startDate'));
    let visitDate = startDate.format('l');
    if (!Ember.isEmpty(endDate) && !startDate.isSame(endDate, 'day')) {
      visitDate += ` - ${moment(endDate).format('l')}`;
    }
    return visitDate;
  }.property('startDate', 'endDate'),

  visitDescription: function() {
    let visitDate = this.get('visitDate');
    let visitType = this.get('visitType');
    return `${visitDate} (${visitType})`;
  }.property('visitDate', 'visitType'),

  validations: {
    endDate: {
      acceptance: {
        accept: true,
        if: dateAcceptance,
        message: 'Please select an end date later than the start date'
      }
    },
    paymentState: {
      acceptance: {
        accept: true,
        if: paymentStateAcceptance
      },
      presence: true
    },
    startDate: {
      acceptance: {
        accept: true,
        if: dateAcceptance,
        message: 'Please select a start date earlier than the end date'
      },
      presence: true
    },
    visitType: {
      presence: true
    }

  }

});
