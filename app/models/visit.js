import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

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

const { computed, get } = Ember;

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
  // Attributes
  customForms: DS.attr('custom-forms'),
  dischargeInfo: DS.attr('string'),
  endDate: DS.attr('date'), // if visit type is outpatient, startDate and endDate are equal
  examiner: DS.attr('string'),
  hasAppointment: DS.attr('boolean', { defaultValue: false }),
  history: DS.attr('string'), // No longer used
  historySince: DS.attr('string'), // History of the Present Illness -- no longer used
  location: DS.attr('string'),
  notes: DS.attr('string'), // this field is being deprecated in favor of patient-note
  outPatient: DS.attr('boolean'),
  paymentState: DS.attr('string', { defaultValue: PAYMENT_STATES.PENDING }),
  primaryDiagnosis: DS.attr('string'), // No longer used -- diagnoses are stored in diagnoses hasMany relationship
  primaryBillingDiagnosis: DS.attr('string'), // AKA final diagnosis
  primaryBillingDiagnosisId: DS.attr('string'),
  reasonForVisit: DS.attr('string'),
  startDate: DS.attr('date'),
  status: DS.attr('string'),
  visitType: DS.attr(),

  // Associations
  charges: DS.hasMany('proc-charge', { async: false }),
  diagnoses: DS.hasMany('diagnosis', { async: false }),
  imaging: DS.hasMany('imaging', { async: true }),
  labs: DS.hasMany('lab', { async: true }),
  medication: DS.hasMany('medication', { async: true }),
  patient: DS.belongsTo('patient', { async: false }),
  patientNotes: DS.hasMany('patient-note', { async: true }),
  procedures: DS.hasMany('procedure', { async: true }),
  vitals: DS.hasMany('vital', { async: true }),
  reports: DS.hasMany('report', { async: true }),

  diagnosisList: computed('diagnoses.[]', function() {
    let diagnoses = get(this, 'diagnoses');
    let diagnosisList = diagnoses.map((diagnosis) => {
      return diagnosis.get('diagnosis');
    });
    return diagnosisList;
  }),

  hasAppointmentLabel: computed('hasAppointment', function() {
    let hasAppointment = get(this, 'hasAppointment');
    let i18n = get(this, 'i18n');
    if (hasAppointment === true) {
      return i18n.t('visits.labels.haveAppointment');
    } else {
      return i18n.t('visits.labels.noAppointment');
    }
  }),

  hasCompletedImaging: computed('imaging.@each.status', function() {
    let imaging = get(this, 'imaging');
    return imaging.isAny(STATUS_FIELD, COMPLETED_STATUS);
  }),

  hasCompletedLabs: computed('labs.@each.status', function() {
    let labs = get(this, 'labs');
    return labs.isAny(STATUS_FIELD, COMPLETED_STATUS);
  }),

  hasCompletedMedication: computed('medication.@each.status', function() {
    let medication = get(this, 'medication');
    return medication.isAny(STATUS_FIELD, FULFILLED_STATUS);
  }),

  hasDoneOrders: computed('imaging.@each.status', 'labs.@each.status', function() {
    let i18n = get(this, 'i18n');
    let imaging = get(this, 'imaging');
    let labs = get(this, 'labs');
    if (imaging.isAny(STATUS_FIELD, REQUESTED_STATUS) || labs.isAny(STATUS_FIELD, REQUESTED_STATUS)) {
      return i18n.t('visits.labels.ordersNotDone');
    } else {
      return i18n.t('visits.labels.haveDoneOrders');
    }
  }),

  primaryDiagnoses: computed('diagnoses.[].secondaryDiagnosis', function() {
    let diagnoses = get(this, 'diagnoses');
    let diagnosisList = diagnoses.filterBy('secondaryDiagnosis', false).map((diagnosis) => {
      return diagnosis.get('diagnosis');
    });
    return diagnosisList.join(', ');
  }),

  visitDate: computed('startDate', 'endDate', function() {
    let endDate = get(this, 'endDate');
    let startDate = moment(get(this, 'startDate'));
    let visitDate = startDate.format('l');
    if (!Ember.isEmpty(endDate) && !startDate.isSame(endDate, 'day')) {
      visitDate += ` - ${moment(endDate).format('l')}`;
    }
    return visitDate;
  }),

  visitDescription: computed('visitDate', 'visitType', function() {
    let visitDate = get(this, 'visitDate');
    let visitType = get(this, 'visitType');
    return `${visitDate} (${visitType})`;
  }),

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
          return get(object, 'checkIn') && !get(object, 'hidePatientSelection');
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