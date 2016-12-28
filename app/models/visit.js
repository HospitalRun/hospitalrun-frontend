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

const { computed } = Ember;

const PAYMENT_STATES = {
  CLEAR: 'clear',
  PENDING: 'pending'
};
const COMPLETED_STATUS = 'Completed';
const FULFILLED_STATUS = 'Fulfilled';
const REQUESTED_STATUS = 'Requested';
const STATUS_FIELD = 'status';

function paymentStateAcceptance(object) {
  return !Object.keys(PAYMENT_STATES)
      .some((state) => PAYMENT_STATES[state] === object.get('paymentState'));
}

export default AbstractModel.extend({
  additionalDiagnoses: DS.attr(), // Yes, the plural of diagnosis is diagnoses!
  charges: DS.hasMany('proc-charge', {
    async: false
  }),
  customForms: DS.attr('custom-forms'),
  diagnoses: DS.hasMany('diagnosis'),
  dischargeInfo: DS.attr('string'),
  endDate: DS.attr('date'), // if visit type is outpatient, startDate and endDate are equal
  examiner: DS.attr('string'),
  hasAppointment: DS.attr('boolean', { defaultValue: false }),
  history: DS.attr('string'), // No longer used
  historySince: DS.attr('string'), // History of the Present Illness -- no longer used
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
  primaryDiagnosis: DS.attr('string'), // No longer used -- diagnoses are stored in diagnoses hasMany relationship
  primaryBillingDiagnosis: DS.attr('string'), // AKA final diagnosis
  primaryBillingDiagnosisId: DS.attr('string'),
  procedures: DS.hasMany('procedure', { async: true }),
  reasonForVisit: DS.attr('string'),
  startDate: DS.attr('date'),
  status: DS.attr('string'),
  visitType: DS.attr(),
  vitals: DS.hasMany('vital', { async: true }),

  diagnosisList: computed('diagnoses.[]', function() {
    let diagnoses = this.get('diagnoses');
    let diagnosisList = diagnoses.map((diagnosis) => {
      return diagnosis.get('diagnosis');
    });
    return diagnosisList;
  }),

  hasAppointmentLabel: computed('hasAppointment', function() {
    let hasAppointment = this.get('hasAppointment');
    let i18n = this.get('i18n');
    if (hasAppointment === true) {
      return i18n.t('visits.labels.haveAppointment');
    } else {
      return i18n.t('visits.labels.noAppointment');
    }
  }),

  hasCompletedImaging: computed('imaging.@each.status', function() {
    let imaging = this.get('imaging');
    return imaging.isAny(STATUS_FIELD, COMPLETED_STATUS);
  }),

  hasCompletedLabs: computed('labs.@each.status', function() {
    let labs = this.get('labs');
    return labs.isAny(STATUS_FIELD, COMPLETED_STATUS);
  }),

  hasCompletedMedication: computed('medication.@each.status', function() {
    let medication = this.get('medication');
    return medication.isAny(STATUS_FIELD, FULFILLED_STATUS);
  }),

  hasDoneOrders: computed('imaging.@each.status', 'labs.@each.status', function() {
    let i18n = this.get('i18n');
    let imaging = this.get('imaging');
    let labs = this.get('labs');
    if (imaging.isAny(STATUS_FIELD, REQUESTED_STATUS) || labs.isAny(STATUS_FIELD, REQUESTED_STATUS)) {
      return i18n.t('visits.labels.ordersNotDone');
    } else {
      return i18n.t('visits.labels.haveDoneOrders');
    }
  }),

  primaryDiagnoses: computed('diagnoses.[].secondaryDiagnosis', function() {
    let diagnoses = this.get('diagnoses');
    let diagnosisList = diagnoses.filterBy('secondaryDiagnosis', false).map((diagnosis) => {
      return diagnosis.get('diagnosis');
    });
    return diagnosisList.join(', ');
  }),

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
    patientTypeAhead: {
      presence: {
        if(object) {
          return (object.get('checkIn') && !object.get('hidePatientSelection'));
        }
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
