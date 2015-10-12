import AbstractModel from 'hospitalrun/models/abstract';
import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import DateFormat from 'hospitalrun/mixins/date-format';
import DS from 'ember-data';
import PatientValidation from 'hospitalrun/utils/patient-validation';
import ResultValidation from 'hospitalrun/mixins/result-validation';

export default AbstractModel.extend(CanEditRequested, DateFormat, ResultValidation, {
  charges: DS.hasMany('proc-charge', {
    async: false
  }),
  labDate: DS.attr('date'),
  labType: DS.belongsTo('pricing', {
    async: false
  }),
  notes: DS.attr('string'),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  requestedBy: DS.attr('string'),
  requestedDate: DS.attr('date'),
  result: DS.attr('string'),
  status: DS.attr('string'),
  visit: DS.belongsTo('visit', {
    async: false
  }),

  labDateAsTime: function() {
    return this.dateToTime(this.get('labDate'));
  }.property('labDate'),

  requestedDateAsTime: function() {
    return this.dateToTime(this.get('requestedDate'));
  }.property('requestedDate'),

  validations: {
    labTypeName: {
      presence: {
        'if': function(object) {
          if (object.get('isNew')) {
            return true;
          }
        },
        message: 'Please select a lab type'
      }
    },
    patientTypeAhead: PatientValidation.patientTypeAhead,
    patient: {
      presence: true
    }
  }
});
