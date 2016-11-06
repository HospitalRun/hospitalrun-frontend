import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(AppointmentStatuses, PatientSubmodule, VisitTypes, {
  appointmentsController: Ember.inject.controller('appointments'),
  endHour: null,
  endMinute: null,
  findPatientVisits: false,
  startHour: null,
  startMinute: null,

  hourList: function() {
    let hour;
    let hourList = [];
    for (hour = 0; hour < 24; hour++) {
      let hourText = (hour % 12) + (hour < 12 ? ' AM' : ' PM');
      if (hourText === '0 AM') {
        hourText = 'Midnight';
      } else if (hourText === '0 PM') {
        hourText = 'Noon';
      }
      hourList.push({
        name: hourText,
        value: hour
      });
    }
    return hourList;
  }.property(),

  locationList: Ember.computed.alias('appointmentsController.locationList'),

  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.provider',
    id: 'physician_list'
  }, {
    name: 'locationList',
    property: 'model.location',
    id: 'visit_location_list'
  }],

  minuteList: function() {
    let minute;
    let minuteList = [];
    for (minute = 0; minute < 60; minute++) {
      minuteList.push(String(`00${minute}`).slice(-2));
    }
    return minuteList;
  }.property(),

  physicianList: Ember.computed.alias('appointmentsController.physicianList'),
  showTime: function() {
    let allDay = this.get('model.allDay');
    let isAdmissionAppointment = this.get('isAdmissionAppointment');
    return (!allDay && isAdmissionAppointment);
  }.property('model.allDay', 'isAdmissionAppointment'),
  visitTypesList: Ember.computed.alias('appointmentsController.visitTypesList'),

  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (Ember.isEmpty(returnTo)) {
      return this._super();
    } else {
      return 'returnTo';
    }
  }.property('model.returnTo'),

  isAdmissionAppointment: function() {
    let model = this.get('model');
    let appointmentType = model.get('appointmentType');
    let isAdmissionAppointment = (appointmentType === 'Admission');
    if (!isAdmissionAppointment) {
      model.set('allDay', true);
    }
    return isAdmissionAppointment;
  }.property('model.appointmentType'),

  updateCapability: 'add_appointment',

  afterUpdate: function() {
    this.send(this.get('cancelAction'));
  },

  beforeUpdate: function() {
    this._updateAppointmentDates();
    return Ember.RSVP.Promise.resolve();
  },

  endHourChanged: function() {
    this._updateDate('endHour', 'endDate');
  }.observes('endHour'),

  endMinuteChanged: function() {
    this._updateDate('endMinute', 'endDate');
  }.observes('endMinute'),

  endTimeHasError: function() {
    let endDateError = this.get('model.errors.endDate');
    return (endDateError.length > 0);
  }.property('model.isValid'),

  isAllDay: function() {
    let allDay = this.get('model.allDay');
    let isAdmissionAppointment = this.get('isAdmissionAppointment');
    if (allDay) {
      let endDate = this.get('model.endDate');
      let startDate = this.get('model.startDate');
      this.set('model.startDate', moment(startDate).startOf('day').toDate());
      this.set('startHour', 0);
      this.set('startMinute', '00');
      this.set('model.endDate', moment(endDate).endOf('day').toDate());
      this.set('endHour', 23);
      this.set('endMinute', '59');
    } else {
      if (isAdmissionAppointment) {
        this._updateAllTimes();
      }
    }
    return allDay;
  }.property('model.allDay'),

  startHourChanged: function() {
    this._updateDate('startHour', 'startDate');
  }.observes('startHour'),

  startMinuteChanged: function() {
    this._updateDate('startMinute', 'startDate');
  }.observes('startMinute'),

  _updateAllTimes: function() {
    this.endHourChanged();
    this.endMinuteChanged();
    this.startMinuteChanged();
    this.startHourChanged();
  },

  _updateAppointmentDates: function() {
    let allDay = this.get('model.allDay');
    let isAdmissionAppointment = this.get('isAdmissionAppointment');
    let appointmentDate = this.get('model.appointmentDate');
    if (!isAdmissionAppointment) {
      this.set('model.endDate', appointmentDate);
      this.set('model.startDate', appointmentDate);
      if (!allDay) {
        this._updateAllTimes();
      }
    }
  },

  _updateDate: function(fieldName, dateFieldName) {
    let model = this.get('model');
    let fieldValue = this.get(fieldName);
    let dateToChange = model.get(dateFieldName);
    if (!Ember.isEmpty(dateToChange)) {
      dateToChange = moment(dateToChange);
      if (fieldName.indexOf('Hour') > -1) {
        dateToChange.hour(fieldValue);
      } else {
        dateToChange.minute(fieldValue);
      }
      model.set(dateFieldName, dateToChange.toDate());
      Ember.run.once(this, function() {
        model.validate().catch(Ember.K);
      });
    }
  }
});
