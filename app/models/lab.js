import AbstractModel from 'hospitalrun/models/abstract';
import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import DateFormat from 'hospitalrun/mixins/date-format';
import DS from 'ember-data';
import Ember from 'ember';
import PatientValidation from 'hospitalrun/utils/patient-validation';
import ResultValidation from 'hospitalrun/mixins/result-validation';

const { computed, get } = Ember;

export default AbstractModel.extend(CanEditRequested, DateFormat, ResultValidation, {
  // Attributes
  labDate: DS.attr('date'),
  notes: DS.attr('string'),
  requestedBy: DS.attr('string'),
  requestedDate: DS.attr('date'),
  result: DS.attr('string'),
  status: DS.attr('string'),

  // Associations
  charges: DS.hasMany('proc-charge', { async: false }),
  labType: DS.belongsTo('pricing', { async: false }),
  patient: DS.belongsTo('patient', { async: false }),
  visit: DS.belongsTo('visit', { async: false }),

  labDateAsTime: computed('labDate', function() {
    return this.dateToTime(get(this, 'labDate'));
  }),

  requestedDateAsTime: computed('requestedDate', function() {
    return this.dateToTime(get(this, 'requestedDate'));
  }),

  validations: {
    labTypeName: {
      presence: {
        'if'(object) {
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
