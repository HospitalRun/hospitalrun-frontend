import AbstractModel from 'hospitalrun/models/abstract';
import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import DateFormat from 'hospitalrun/mixins/date-format';
import DS from 'ember-data';
import Ember from 'ember';
import PatientValidation from 'hospitalrun/utils/patient-validation';
import ResultValidation from 'hospitalrun/mixins/result-validation';

const { computed } = Ember;

export default AbstractModel.extend(CanEditRequested, DateFormat, ResultValidation, {
  // Attributes
  imagingDate: DS.attr('date'),
  notes: DS.attr('string'),
  radiologist: DS.attr('string'),
  requestedBy: DS.attr('string'),
  requestedDate: DS.attr('date'),
  result: DS.attr('string'),
  status: DS.attr('string'),

  // Associations
  charges: DS.hasMany('proc-charge', { async: false }),
  imagingType: DS.belongsTo('pricing', { async: false }),
  patient: DS.belongsTo('patient', { async: false }),
  visit: DS.belongsTo('visit', { async: false }),

  imagingDateAsTime: computed('imagingDate', function() {
    return this.dateToTime(this.get('imagingDate'));
  }),

  requestedDateAsTime: computed('requestedDate', function() {
    return this.dateToTime(this.get('requestedDate'));
  }),

  validations: {
    imagingTypeName: {
      presence: {
        'if'(object) {
          if (object.get('isNew')) {
            return true;
          }
        },
        message: 'Please select an imaging type'
      }
    },
    patientTypeAhead: PatientValidation.patientTypeAhead,
    patient: {
      presence: true
    }
  }
});
