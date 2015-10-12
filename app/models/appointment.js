import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import PatientValidation from 'hospitalrun/utils/patient-validation';

export default AbstractModel.extend({
  allDay: DS.attr(),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  provider: DS.attr('string'),
  location: DS.attr('string'),
  appointmentType: DS.attr('string'),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  notes: DS.attr('string'),
  status: DS.attr('string', { defaultValue: 'Scheduled' }),

  longDateFormat: 'l h:mm A',
  shortDateFormat: 'l',
  timeFormat: 'h:mm A',

  _getDateSpan: function(startDate, endDate, format) {
    var formattedStart = startDate.format(format),
      formattedEnd = endDate.format(format);
    return '%@ - %@'.fmt(formattedStart, formattedEnd);
  },

  appointmentDate: function() {
    var startDate = this.get('startDate');
    return startDate;
  }.property('startDate'),

  displayStatus: function() {
    var status = this.get('status');
    if (Ember.isEmpty(status)) {
      status = 'Scheduled';
    }
    return status;
  }.property('status'),

  formattedAppointmentDate: function() {
    var allDay = this.get('allDay'),
      endDate = moment(this.get('endDate')),
      dateFormat = '',
      formattedDate = '',
      startDate = moment(this.get('startDate'));

    if (startDate.isSame(endDate, 'day')) {
      formattedDate = startDate.format(this.get('shortDateFormat'));
      if (!allDay) {
        formattedDate += ' ';
        formattedDate += this._getDateSpan(startDate, endDate, this.get('timeFormat'));
      }
    } else {
      if (allDay) {
        dateFormat = this.get('shortDateFormat');
      } else {
        dateFormat = this.get('longDateFormat');
      }
      formattedDate = this._getDateSpan(startDate, endDate, dateFormat);
    }
    return formattedDate;
  }.property('startDate', 'endDate'),

  validations: {
    appointmentDate: {
      presence: {
        if: function(object) {
          var appointmentType = object.get('appointmentType');
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
        if: function(object) {
          if (!object.get('isDirty')) {
            return false;
          }
          var allDay = object.get('allDay'),
            startDate = object.get('startDate'),
            endDate = object.get('endDate');
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
