import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import moment from 'moment';
import PatientValidation from 'hospitalrun/utils/patient-validation';

export default AbstractModel.extend({
  // Attributes
  allDay: DS.attr(),
  provider: DS.attr('string'),
  location: DS.attr('string'),
  appointmentType: DS.attr('string'),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  notes: DS.attr('string'),
  status: DS.attr('string', { defaultValue: 'Scheduled' }),

  // Associations
  patient: DS.belongsTo('patient', { async: false }),
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
    let startDate = this.get('startDate');
    return startDate;
  }),

  displayStatus: computed('status', function() {
    let status = this.get('status');
    if (isEmpty(status)) {
      status = 'Scheduled';
    }
    return status;
  }),

  formattedAppointmentDate: computed('startDate', 'endDate', function() {
    let allDay = this.get('allDay');
    let endDate = moment(this.get('endDate'));
    let dateFormat = '';
    let formattedDate = '';
    let startDate = moment(this.get('startDate'));

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
  }),

  validations: {
    appointmentDate: {
      presence: {
        if(object) {
          let appointmentType = object.get('appointmentType');
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
    startDate: {
      acceptance: {
        accept: true,
        if(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          let allDay = object.get('allDay');
          let startDate = object.get('startDate');
          let endDate = object.get('endDate');
          if (isEmpty(startDate)) {
            // force validation to fail
            return true;
          } else if  (!isEmpty(endDate)) {
            // end date is already selected; do further validation
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
        message: 'Please select a start date earlier than the end date'
      }
    },
    endDate: {
      acceptance: {
        accept: true,
        if(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          let allDay = object.get('allDay');
          let startDate = object.get('startDate');
          let endDate = object.get('endDate');
          if (isEmpty(endDate) || isEmpty(startDate)) {
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
