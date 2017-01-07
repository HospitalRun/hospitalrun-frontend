import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import PatientValidation from 'hospitalrun/utils/patient-validation';

const { get, computed } = Ember;

export default AbstractModel.extend({
  // Attributes
  allDay: DS.attr(),
  appointmentType: DS.attr('string'),
  endDate: DS.attr('date'),
  location: DS.attr('string'),
  notes: DS.attr('string'),
  provider: DS.attr('string'),
  startDate: DS.attr('date'),
  status: DS.attr('string', { defaultValue: 'Scheduled' }),
  // Associations
  patient: DS.belongsTo('patient', {
    async: false
  }),
  visits: DS.hasMany('visit'),

  // Formats
  longDateFormat: 'l h:mm A',
  shortDateFormat: 'l',
  timeFormat: 'h:mm A',

  _getDateSpan(startDate, endDate, format) {
    let formattedStart = startDate.format(format);
    let formattedEnd = endDate.format(format);
    return `${formattedStart} - ${formattedEnd}`;
  },

  appointmentDate: computed('startDate', function() {
    let startDate = get(this, 'startDate');
    return startDate;
  }),

  displayStatus: computed('status', function() {
    let status = get(this, 'status');
    if (Ember.isEmpty(status)) {
      status = 'Scheduled';
    }
    return status;
  }),

  formattedAppointmentDate: computed('startDate', 'endDate', function() {
    let allDay = get(this, 'allDay');
    let endDate = moment(get(this, 'endDate'));
    let dateFormat = '';
    let formattedDate = '';
    let startDate = moment(get(this, 'startDate'));

    if (startDate.isSame(endDate, 'day')) {
      formattedDate = startDate.format(get(this, 'shortDateFormat'));
      if (!allDay) {
        formattedDate += ' ';
        formattedDate += this._getDateSpan(startDate, endDate, get(this, 'timeFormat'));
      }
    } else {
      if (allDay) {
        dateFormat = get(this, 'shortDateFormat');
      } else {
        dateFormat = get(this, 'longDateFormat');
      }
      formattedDate = this._getDateSpan(startDate, endDate, dateFormat);
    }
    return formattedDate;
  }),

  validations: {
    appointmentDate: {
      presence: {
        if(object) {
          let appointmentType = get(object, 'appointmentType');
          return appointmentType !== 'Admission';
        }
      }
    },

    patientTypeAhead: PatientValidation.patientTypeAhead,

    patient: {
      presence: true
    },

    appointmentType: {
      presence: true
    },

    location: {
      presence: true
    },

    startDate: {
      presence: true
    },
    endDate: {
      acceptance: {
        accept: true,
        if(object) {
          if (!get(object, 'hasDirtyAttributes')) {
            return false;
          }
          let allDay    = get(object, 'allDay');
          let startDate = get(object, 'startDate');
          let endDate   = get(object, 'endDate');
          if (Ember.isEmpty(endDate) || Ember.isEmpty(startDate)) {
            // force validation to fail
            return true;
          } else {
            if (allDay) {
              if (endDate.getTime() < startDate.getTime()) {
                return true;
              }
            } else {
              if (endDate.getTime() <= startDate.getTime()) {
                return true;
              }
            }
          }
          // patient is properly selected; don't do any further validation
          return false;

        },
        message: 'Please select an end date later than the start date'
      }
    }
  }
});
